// CPU-based Flow modifier for permanent geometry deformation
// Perfect for 3D model export (FBX, etc.)

import { BufferGeometry, CatmullRomCurve3, Mesh, Vector3 } from "three";

export class CPUFlow {
  private mesh: Mesh;
  private originalPositions: Float32Array;
  private curve?: CatmullRomCurve3;
  private spineLength: number = 400;
  private spineOffset: number = 0; // Changed from 161 to 0

  constructor(mesh: Mesh) {
    this.mesh = mesh.clone();

    // Store original positions for reference
    const geometry = this.mesh.geometry as BufferGeometry;
    const positions = geometry.attributes.position;
    this.originalPositions = new Float32Array(positions.array);

    // Auto-calculate spine parameters from geometry bounds
    geometry.computeBoundingBox();
    if (geometry.boundingBox) {
      this.spineLength =
        geometry.boundingBox.max.x - geometry.boundingBox.min.x;
      this.spineOffset = -geometry.boundingBox.min.x; // Offset to make min.x = 0
    }
  }

  updateCurve(curve: CatmullRomCurve3) {
    this.curve = curve;
    // Don't override spineLength - use the geometry-based calculation
    this.applyDeformation();
  }

  private applyDeformation() {
    if (!this.curve) return;

    const geometry = this.mesh.geometry as BufferGeometry;
    const positions = geometry.attributes.position;
    const normals = geometry.attributes.normal;

    // Ensure curve has proper arc length divisions for smooth sampling
    this.curve.updateArcLengths();

    // Process each vertex
    for (let i = 0; i < positions.count; i++) {
      const idx = i * 3;

      // Get original vertex position
      const x = this.originalPositions[idx];
      const y = this.originalPositions[idx + 1];
      const z = this.originalPositions[idx + 2];

      // Calculate position along the spine (normalized 0-1)
      const spinePortion = (x + this.spineOffset) / this.spineLength;
      const t = Math.max(0, Math.min(1, spinePortion)); // Clamp to 0-1

      // Get curve point and frame at this position
      const curvePoint = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t).normalize();

      // Calculate normal and binormal using consistent frame
      // For a circular curve in XZ plane, up should be Y
      const up = new Vector3(0, 1, 0);
      const binormal = new Vector3().crossVectors(tangent, up).normalize();
      const normal = new Vector3().crossVectors(binormal, tangent).normalize();

      // If binormal is too small (tangent is vertical), use a different up vector
      if (binormal.length() < 0.1) {
        const altUp = new Vector3(1, 0, 0);
        binormal.crossVectors(tangent, altUp).normalize();
        normal.crossVectors(binormal, tangent).normalize();
      }

      // Transform local coordinates to curve frame
      // x follows the curve, y is up, z is cross-curve
      const localOffset = new Vector3(0, y, z); // x=0 since we're placing on curve

      // Apply the frame transformation
      const transformedOffset = new Vector3();
      transformedOffset.addScaledVector(tangent, 0); // No tangent offset
      transformedOffset.addScaledVector(normal, y); // Y becomes normal direction
      transformedOffset.addScaledVector(binormal, z); // Z becomes binormal direction

      // Final position = curve point + transformed offset
      const newPosition = curvePoint.clone().add(transformedOffset);

      // Update vertex position
      positions.setXYZ(i, newPosition.x, newPosition.y, newPosition.z);

      // Update normals if they exist
      if (normals) {
        // Transform the normal using the same frame
        const originalNormal = new Vector3(
          normals.getX(i),
          normals.getY(i),
          normals.getZ(i),
        );

        const transformedNormal = new Vector3();
        transformedNormal.x = originalNormal.dot(tangent);
        transformedNormal.y = originalNormal.dot(normal);
        transformedNormal.z = originalNormal.dot(binormal);

        normals.setXYZ(
          i,
          transformedNormal.x,
          transformedNormal.y,
          transformedNormal.z,
        );
      }
    }

    // Mark attributes as needing update
    positions.needsUpdate = true;
    if (normals) normals.needsUpdate = true;

    // Recompute bounding sphere/box
    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();
  }

  get object3D(): Mesh {
    return this.mesh;
  }

  // Set spine parameters
  setSpineOffset(offset: number) {
    this.spineOffset = offset;
    if (this.curve) this.applyDeformation();
  }

  setSpineLength(length: number) {
    this.spineLength = length;
    if (this.curve) this.applyDeformation();
  }
}
