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
import { ColumnScotia, generateProfilePoints } from "./column-scotia-geometry";

export type ColumnEchinus = ColumnScotia;

export function columnEchinus(settings: ColumnEchinus, material: Material) {
  const profile = generateProfilePoints({
    topRadius: settings.bottomRadius,
    topHeight: settings.bottomHeight,
    bottomRadius: settings.topRadius,
    bottomHeight: settings.topHeight,
    height: settings.height,
    divisions: settings.divisions,
    radialSegments: settings.radialSegments,
  });

  const geometry = new LatheGeometry(profile, settings.radialSegments);
  geometry.computeVertexNormals();

  geometry.applyMatrix4(new Matrix4().makeRotationX(Math.PI));
  geometry.applyMatrix4(new Matrix4().makeTranslation(0, settings.height, 0));

  return new Mesh(geometry, material);
}

/// #if DEBUG
export class GUIEchinus extends GUIController {
  constructor(
    gui: GUIType,
    public target: ColumnEchinus,
    title = "Echinus",
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title });

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
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
