import { CylinderGeometry, Material, Matrix4, Mesh, Vector3 } from "three";

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
  buldge: number;
  radius: number;
  heightSegments: number;
  radialSegments: number;
  /** Profile type - determines the mathematical curve used */
  profileType: TorusProfileType;
  /** Profile sharpness - controls how "stubby" or round the profile appears (0.1-3.0) */
  profileSharpness: number;
  /** Vertical compression - flattens the profile vertically (0.1-1.0) */
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
  profileType: TorusProfileType,
  sharpness: number,
  compression: number,
): number {
  // Convert to symmetric range (-1 to 1) for profile calculations
  const symmetricY = (normalizedY - 0.5) * 2;

  let bulgeFactor: number;

  switch (profileType) {
    case "semicircular":
      // Classic semicircular profile - perfect torus cross-section
      const angle = normalizedY * Math.PI;
      bulgeFactor = Math.sin(angle);
      break;

    case "cushion":
      // Rounded rectangle profile - flatter with rounded edges
      // Uses a modified cosine function with power adjustment
      const cushionAngle = normalizedY * Math.PI;
      const baseCushion = Math.sin(cushionAngle);
      bulgeFactor = Math.pow(baseCushion, 1 / sharpness);
      break;

    case "elliptical":
      // Elliptical profile - more elongated vertically or horizontally
      const ellipseY = symmetricY * compression;
      bulgeFactor = Math.sqrt(Math.max(0, 1 - ellipseY * ellipseY));
      break;

    case "parabolic":
      // Parabolic profile - sharper peak, flatter base
      const parabolicBase = 4 * normalizedY * (1 - normalizedY);
      bulgeFactor = Math.pow(parabolicBase, sharpness);
      break;

    default:
      bulgeFactor = Math.sin(normalizedY * Math.PI);
  }

  // Apply vertical compression to flatten the profile
  bulgeFactor *= compression;

  return Math.max(0, bulgeFactor);
}

export function columnTorus(settings: ColumnTorus, material: Material) {
  // Calculate dimensions
  const actualHeight = settings.height;
  const bulgeRadius = settings.buldge;
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
      settings.profileType,
      settings.profileSharpness,
      settings.verticalCompression,
    );

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

export function columnTorusBindings(gui: GUIType, settings: ColumnTorus) {
  const folder = gui.addFolder({ title: "Column Torus" });

  // Basic dimensions
  folder.addBinding(settings, "height", { min: 0, max: 10 });
  folder.addBinding(settings, "radius", { min: 0, max: 20 });
  folder.addBinding(settings, "buldge", { min: 0, max: 5 });

  // Geometry quality
  folder.addBinding(settings, "heightSegments", {
    min: 4,
    max: 64,
    step: 1,
  });
  folder.addBinding(settings, "radialSegments", {
    min: 6,
    max: 64,
    step: 1,
  });

  // Profile controls
  folder.addBinding(settings, "profileType", {
    options: {
      "Semicircular (Classic)": "semicircular",
      "Cushion (Rounded Rectangle)": "cushion",
      Elliptical: "elliptical",
      Parabolic: "parabolic",
    },
  });

  folder.addBinding(settings, "profileSharpness", {
    min: 0.1,
    max: 3.0,
    step: 0.1,
    label: "Sharpness",
  });

  folder.addBinding(settings, "verticalCompression", {
    min: 0.1,
    max: 1.0,
    step: 0.05,
    label: "Compression",
  });

  return folder;
}
