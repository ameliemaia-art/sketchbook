import { CylinderGeometry, Material, Matrix4, Mesh, Vector3 } from "three";

import { GUIType } from "@utils/gui/gui-types";

export type ColumnTorus = {
  height: number;
  buldge: number;
  radius: number;
  heightSegments: number;
  radialSegments: number;
};

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

export function columnTorusBindings(gui: GUIType, settings: ColumnTorus) {
  const folder = gui.addFolder({ title: "Column Torus" });
  folder.addBinding(settings, "height", { min: 0 });
  folder.addBinding(settings, "radius", { min: 0 });
  folder.addBinding(settings, "buldge", { min: 0 });
  return folder;
}
