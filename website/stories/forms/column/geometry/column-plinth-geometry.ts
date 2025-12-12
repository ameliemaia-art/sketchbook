import { BoxGeometry, Material, Matrix4, Mesh } from "three";

import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import { wireframeMaterial } from "../../materials/materials";
import { getGeometryDimensions } from "./column-echinus-geometry";

export type ColumnPlinth = {
  height: number;
  width: number;
  widthSegments: number;
  heightSegments: number;
  depthSegments: number;
  helper: boolean;
  wireframe: boolean;
};

export function columnPlinth(settings: ColumnPlinth, material: Material) {
  const geometry = new BoxGeometry(
    settings.width,
    settings.height,
    settings.width,
    settings.widthSegments,
    settings.heightSegments,
    settings.depthSegments,
  );

  const dimensions = getGeometryDimensions(geometry);

  geometry.applyMatrix4(
    new Matrix4().makeTranslation(0, dimensions.height / 2, 0),
  );
  return new Mesh(geometry, settings.wireframe ? wireframeMaterial : material);
}

/// #if DEBUG
export class GUIPlinth extends GUIController {
  constructor(
    gui: GUIType,
    public target: ColumnPlinth,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Plinth" });

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
    this.gui.addBinding(target, "helper").on("change", this.onChange);
    this.gui.addBinding(target, "wireframe").on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
