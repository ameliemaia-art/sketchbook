import { CylinderGeometry, Material, Matrix4, Mesh, Vector3 } from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";

/**
 * Torus profile types found in classical architecture
 */
export enum TorusProfileType {
  SEMICIRCULAR = "semicircular",
  CUSHION = "cushion",
  ELLIPTICAL = "elliptical",
  PARABOLIC = "parabolic",
}

export type ColumnTorus = {
  height: number;
  radius: number;
  heightSegments: number;
  radialSegments: number;
  buldge: number; // Bulge radius factor
  profileSharpness: number;
  verticalCompression: number;
};

/**
 * Calculate bulge factor based on profile type and parameters
 * @param normalizedY - Height position (0 to 1)
 * @param profileType - Type of mathematical curve to use
 * @param sharpness - Controls curve steepness/roundness
 * @param compression - Vertical flattening factor
 */
function calculateBulgeFactor(
  normalizedY: number,
  sharpness: number,
  compression: number,
): number {
  // Convert to symmetric range (-1 to 1) for profile calculations
  const symmetricY = (normalizedY - 0.5) * 2;

  const cushionAngle = normalizedY * Math.PI;
  const baseCushion = Math.sin(cushionAngle);
  let bulgeFactor = Math.pow(baseCushion, 1 / sharpness);

  // Apply vertical compression to flatten the profile
  bulgeFactor *= compression;

  return Math.max(0, bulgeFactor);
}

export function columnTorus(settings: ColumnTorus, material: Material) {
  // Calculate dimensions
  const actualHeight = settings.height;
  const baseRadius = settings.radius;

  const geometry = new CylinderGeometry(
    baseRadius,
    baseRadius,
    actualHeight,
    settings.radialSegments,
    settings.heightSegments,
    false,
  );

  // Get position attribute for vertex manipulation
  const positionAttribute = geometry.getAttribute("position");
  const vertex = new Vector3();

  // Apply parametric bulge modifier to vertices
  for (let i = 0; i < positionAttribute.count; i++) {
    vertex.fromBufferAttribute(positionAttribute, i);

    // Calculate normalized height position (0 to 1)
    const normalizedY = (vertex.y + actualHeight / 2) / actualHeight;

    // Calculate bulge factor using selected profile type
    const bulgeFactor = calculateBulgeFactor(
      normalizedY,
      settings.profileSharpness,
      settings.verticalCompression,
    );

    // Calculate distance from center (for radial displacement)
    const distanceFromCenter = Math.sqrt(
      vertex.x * vertex.x + vertex.z * vertex.z,
    );

    // Apply bulge displacement only if vertex is on the outer surface
    if (distanceFromCenter > 0) {
      const bulgeAmount = settings.buldge * bulgeFactor;
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

  // Mark geometry as updated
  positionAttribute.needsUpdate = true;

  // Recalculate normals for proper lighting
  geometry.computeVertexNormals();

  // Position at the specified height
  geometry.applyMatrix4(new Matrix4().makeTranslation(0, actualHeight / 2, 0));

  // Update vertex normals
  geometry.computeVertexNormals();

  return new Mesh(geometry, material);
}

/// #if DEBUG
export class GUITorus extends GUIController {
  constructor(
    gui: GUIType,
    public target: ColumnTorus,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Torus" });

    // Basic dimensions
    this.gui
      .addBinding(target, "height", { min: 0, max: 10 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "radius", { min: 0, max: 20 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "buldge", { min: 0, max: 5 })
      .on("change", this.onChange);

    // Geometry quality
    this.gui
      .addBinding(target, "heightSegments", {
        min: 4,
        max: 64,
        step: 1,
      })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "radialSegments", {
        min: 6,
        max: 64,
        step: 1,
      })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "profileSharpness", {
        min: 0,
      })
      .on("change", this.onChange);

    this.gui
      .addBinding(target, "verticalCompression", {
        min: 0,
      })
      .on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
