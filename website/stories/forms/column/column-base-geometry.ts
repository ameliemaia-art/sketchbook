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

import { GUIType } from "@utils/gui/gui-types";

type ColumnPlinth = {
  height: number;
  width: number;
};

type ColumnTorus = {
  height: number;
  buldge: number;
  radius: number;
  heightSegments: number;
  radialSegments: number;
};

type ColumnFillet = {
  height: number;
  radius: number;
  radialSegments: number;
};

export type ColumnBaseSettings = {
  plinth: ColumnPlinth;
  torus: ColumnTorus;
  fillet: ColumnFillet;
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

export function columnFillet(settings: ColumnFillet, material: Material) {
  const geometry = new CylinderGeometry(
    settings.radius,
    settings.radius,
    settings.height,
    settings.radialSegments,
    1,
    false,
  );
  geometry.applyMatrix4(
    new Matrix4().makeTranslation(0, settings.height / 2, 0),
  );
  return new Mesh(geometry, material);
}

export function columnBase(settings: ColumnBaseSettings, material: Material) {
  const group = new Group();
  group.name = "column-base";
  const plinth = columnPlinth(settings.plinth, material);
  // const torus = columnTorus(settings.torus, material);
  const fillet = columnFillet(settings.fillet, material);
  // torus.position.y = settings.plinth.height;
  fillet.position.y = settings.plinth.height;

  // group.add(torus);
  group.add(plinth);
  group.add(fillet);
  return group;
}

export function columnTorusBindings(gui: GUIType, settings: ColumnTorus) {
  const folder = gui.addFolder({ title: "Column Torus" });
  folder.addBinding(settings, "height", { min: 0 });
  folder.addBinding(settings, "radius", { min: 0 });
  folder.addBinding(settings, "buldge", { min: 0 });

  return folder;
}
