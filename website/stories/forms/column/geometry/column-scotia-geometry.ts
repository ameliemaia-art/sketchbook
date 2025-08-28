import {
  BoxGeometry,
  LatheGeometry,
  Material,
  Matrix4,
  Mesh,
  Vector2,
} from "three";

import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import { wireframeMaterial } from "../../materials/materials";

export type ColumnScotia = {
  topRadius: number;
  topHeight: number;
  bottomRadius: number;
  bottomHeight: number;
  height: number;
  divisions: number;
  radialSegments: number;
  helper: boolean;
  wireframe: boolean;
};

export function generateProfilePoints(settings: ColumnScotia): Vector2[] {
  const points: Vector2[] = [];
  // Bottom left
  points.push(new Vector2(0, 0));
  // Bottom left end
  points.push(new Vector2(settings.bottomRadius, 0));
  // Move up
  points.push(new Vector2(settings.bottomRadius, settings.bottomHeight));
  // Arc (scotia curve)
  const arcStart = new Vector2(settings.bottomRadius, settings.bottomHeight);
  const arcEnd = new Vector2(
    settings.topRadius,
    settings.height - settings.topHeight,
  );
  const arcCenter = new Vector2(arcStart.x, arcEnd.y);
  const radiusX = arcStart.x - arcEnd.x;
  const radiusY = arcStart.y - arcEnd.y;
  for (let i = 0; i < settings.divisions; i++) {
    const t = i / (settings.divisions - 1);
    const theta = Math.PI / 2 + (Math.PI / 2) * t; // 90° to 180°
    const x = arcCenter.x + radiusX * Math.cos(theta);
    const y = arcCenter.y + radiusY * Math.sin(theta);
    points.push(new Vector2(x, y));
  }
  // Top left end
  points.push(
    new Vector2(settings.topRadius, settings.height - settings.topHeight),
  );
  // Top left end top
  points.push(new Vector2(settings.topRadius, settings.height));
  // Top left
  points.push(new Vector2(0, settings.height));

  return points;
}

export function columnScotia(settings: ColumnScotia, material: Material) {
  const profile = generateProfilePoints(settings);

  const geometry = new LatheGeometry(profile, settings.radialSegments);
  geometry.computeVertexNormals();

  return new Mesh(geometry, settings.wireframe ? wireframeMaterial : material);
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
      .addBinding(target, "bottomRadius", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "topRadius", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "height", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "bottomHeight", { min: 0 })
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
    this.gui.addBinding(target, "helper").on("change", this.onChange);
    this.gui.addBinding(target, "wireframe").on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
