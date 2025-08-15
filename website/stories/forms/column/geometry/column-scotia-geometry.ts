import {
  BoxGeometry,
  LatheGeometry,
  Material,
  Matrix4,
  Mesh,
  Vector2,
} from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";

export type ColumnScotia = {
  baseRadius: number;
  height: number;
  bottomLength: number;
  bottomHeight: number;
  topLength: number;
  topHeight: number;
  divisions: number;
  radialSegments: number;
  heightSegments: number;
};

export function generateScotiaProfilePoints(
  baseRadius: number,
  height: number,
  bottomLength: number,
  bottomHeight: number,
  topLength: number,
  topHeight: number,
  divisions: number,
): Vector2[] {
  const points: Vector2[] = [];
  // Build profile points (adapted from scotia-geometry)
  // Bottom left
  points.push(new Vector2(0, 0));
  // Bottom left end
  points.push(new Vector2(baseRadius, 0));
  // Move up
  points.push(new Vector2(baseRadius, height * bottomHeight));
  // Arc (scotia curve)
  const arcStart = new Vector2(
    baseRadius * bottomLength,
    height * bottomHeight,
  );
  const arcEnd = new Vector2(baseRadius * topLength, height * (1 - topHeight));
  const arcCenter = new Vector2(arcStart.x, arcEnd.y);
  const radiusX = arcStart.x - arcEnd.x;
  const radiusY = arcStart.y - arcEnd.y;
  for (let i = 0; i < divisions; i++) {
    const t = i / (divisions - 1);
    const theta = Math.PI / 2 + (Math.PI / 2) * t; // 90° to 180°
    const x = arcCenter.x + radiusX * Math.cos(theta);
    const y = arcCenter.y + radiusY * Math.sin(theta);
    points.push(new Vector2(x, y));
  }
  // Top left end
  points.push(new Vector2(baseRadius * topLength, height * (1 - topHeight)));
  // Top left end top
  points.push(new Vector2(baseRadius * topLength, height));
  // Top left
  points.push(new Vector2(0, height));

  return points;
}

export function columnScotia(settings: ColumnScotia, material: Material) {
  const profile = generateScotiaProfilePoints(
    settings.baseRadius,
    settings.height,
    settings.bottomLength,
    settings.bottomHeight,
    settings.topLength,
    settings.topHeight,
    settings.divisions,
  );

  // Create LatheGeometry
  const geometry = new LatheGeometry(profile, settings.radialSegments || 32);
  geometry.applyMatrix4(
    new Matrix4().makeTranslation(0, settings.height / 2, 0),
  );
  geometry.computeVertexNormals();
  return new Mesh(geometry, material);
}

/// #if DEBUG
export class GUIScotia extends GUIController {
  constructor(
    gui: GUIType,
    public target: ColumnScotia,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Scotia" });

    this.gui
      .addBinding(target, "baseRadius", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "height", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "bottomLength", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "bottomHeight", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "topLength", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "topHeight", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "divisions", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "radialSegments", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "heightSegments", { min: 0 })
      .on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
