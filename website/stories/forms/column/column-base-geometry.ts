import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Group,
  LatheGeometry,
  Material,
  Matrix4,
  Mesh,
  Vector2,
  Vector3,
} from "three";

type ColumnPlinth = {
  height: number;
  width: number;
};

type ColumnTorus = {
  height: number;
  radius: number; // How far the torus bulges from the column
  columnRadius: number; // Base radius of the column
  startX?: number; // Starting position offset (optional)
};

export type ColumnBaseSettings = {
  plinth: ColumnPlinth;
  torus: ColumnTorus;
};

export function columnPlinth(settings: ColumnPlinth, material: Material) {
  const geometry = new BoxGeometry(
    settings.width,
    settings.height,
    settings.width,
  );
  geometry.applyMatrix4(
    new Matrix4().makeTranslation(0, settings.height / 2, 0),
  );
  return new Mesh(geometry, material);
}

export function columnTorus(settings: ColumnTorus, material: Material) {
  // Calculate dimensions
  const actualHeight = settings.height;
  const bulgeRadius = settings.radius;
  const baseRadius = settings.columnRadius;
  const startOffset = settings.startX || 0;

  // Create high-subdivision cylinder
  const heightSegments = 32; // High subdivision for smooth curve
  const radialSegments = 32; // Standard radial segments

  const geometry = new CylinderGeometry(
    baseRadius + startOffset, // Top radius (column edge)
    baseRadius + startOffset, // Bottom radius (column edge)
    actualHeight,
    radialSegments,
    heightSegments,
    false, // Not open ended
  );

  // Get position attribute for vertex manipulation
  const positionAttribute = geometry.getAttribute("position");
  const vertex = new Vector3();

  // Apply bulge modifier to vertices
  for (let i = 0; i < positionAttribute.count; i++) {
    vertex.fromBufferAttribute(positionAttribute, i);

    // Calculate normalized height position (0 to 1)
    const normalizedY = (vertex.y + actualHeight / 2) / actualHeight;

    // Calculate bulge factor using semicircle function (0 to π)
    const angle = normalizedY * Math.PI;
    const bulgeFactor = Math.sin(angle); // 0 at ends, 1 at middle

    // Calculate distance from center (for radial displacement)
    const distanceFromCenter = Math.sqrt(
      vertex.x * vertex.x + vertex.z * vertex.z,
    );

    // Apply bulge displacement only if vertex is on the outer surface
    if (distanceFromCenter > 0) {
      const bulgeAmount = bulgeRadius * bulgeFactor;
      const normalizedDirection = new Vector3(
        vertex.x,
        0,
        vertex.z,
      ).normalize();

      // Displace vertex outward by bulge amount
      vertex.x += normalizedDirection.x * bulgeAmount;
      vertex.z += normalizedDirection.z * bulgeAmount;
    }

    // Update the position
    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  // Recalculate normals for proper lighting
  geometry.computeVertexNormals();

  // Position at the specified height
  geometry.applyMatrix4(new Matrix4().makeTranslation(0, actualHeight / 2, 0));

  return new Mesh(geometry, material);
}

export function columnBase(settings: ColumnBaseSettings, material: Material) {
  const group = new Group();
  group.name = "column-base";
  group.add(columnTorus(settings.torus, material));
  // group.add(columnPlinth(settings.plinth, material));
  return group;
}
