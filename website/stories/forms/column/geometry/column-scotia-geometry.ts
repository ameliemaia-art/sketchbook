import { BoxGeometry, Material, Matrix4, Mesh } from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";

export type ColumnScotia = {
  height: number;
  width: number;
  widthSegments: number;
  heightSegments: number;
  depthSegments: number;
};

export function columnScotia(settings: ColumnScotia, material: Material) {
  const geometry = new BoxGeometry(
    settings.width,
    settings.height,
    settings.width,
    settings.widthSegments,
    settings.heightSegments,
    settings.depthSegments,
  );
  geometry.applyMatrix4(
    new Matrix4().makeTranslation(0, settings.height / 2, 0),
  );
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
      .addBinding(target, "width", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "height", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "widthSegments", { min: 1 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "heightSegments", { min: 1 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "depthSegments", { min: 1 })
      .on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
