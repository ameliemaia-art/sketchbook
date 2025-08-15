import {
  CylinderGeometry,
  LatheGeometry,
  Material,
  Matrix4,
  Mesh,
  Vector2,
  Vector3,
} from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";

export type ColumnTorus = {
  height: number;
  radius: number;
  heightSegments: number;
  radialSegments: number;
  buldge: number;
};

export function generateTorusProfilePoints(
  baseRadius: number,
  buldge: number,
  height: number,
  divisions: number,
): Vector2[] {
  const points: Vector2[] = [];

  // 1. Start at column center, bottom
  points.push(new Vector2(0, -height / 2));

  // 2. Move out to base radius, bottom
  points.push(new Vector2(baseRadius, -height / 2));

  // 3. Generate curve points (using -90° to 90° distribution)
  for (let i = 0; i < divisions; i++) {
    const t = i / (divisions - 1);
    const theta = -90 + 180 * t; // -90° to 90°
    const rad = (Math.PI / 180) * theta;
    const x = baseRadius + buldge * Math.cos(rad);
    const y = buldge * Math.sin(rad);
    // Center the curve vertically
    points.push(new Vector2(x, y));
  }

  // 4. Move back to base radius, top
  points.push(new Vector2(baseRadius, height / 2));

  // 5. End at column center, top
  points.push(new Vector2(0, height / 2));

  return points;
}

export function columnTorus(settings: ColumnTorus, material: Material) {
  const profile = generateTorusProfilePoints(
    settings.radius,
    settings.buldge,
    settings.height,
    settings.radialSegments,
  );
  const geometry = new LatheGeometry(profile, settings.radialSegments);

  // Move the geometry so its bottom sits at y = 0
  geometry.applyMatrix4(
    new Matrix4().makeTranslation(0, settings.height / 2, 0),
  );

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
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
