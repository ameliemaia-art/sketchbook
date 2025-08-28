import { CylinderGeometry, Material, Matrix4, Mesh } from "three";

import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import { wireframeMaterial } from "../../materials/materials";
import { getGeometryDimensions } from "./column-echinus-geometry";

export type ColumnFillet = {
  height: number;
  radius: number;
  radialSegments: number;
  helper: boolean;
  wireframe: boolean;
};

export function columnFillet(settings: ColumnFillet, material: Material) {
  const geometry = new CylinderGeometry(
    settings.radius,
    settings.radius,
    settings.height,
    settings.radialSegments,
    1,
    false,
  );

  const dimensions = getGeometryDimensions(geometry);

  geometry.applyMatrix4(
    new Matrix4().makeTranslation(0, dimensions.height / 2, 0),
  );
  return new Mesh(geometry, settings.wireframe ? wireframeMaterial : material);
}

/// #if DEBUG
export class GUIFillet extends GUIController {
  constructor(
    gui: GUIType,
    public target: ColumnFillet,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Fillet" });
    this.gui
      .addBinding(target, "height", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "radius", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "radialSegments", { min: 3 })
      .on("change", this.onChange);
    this.gui.addBinding(target, "helper").on("change", this.onChange);
    this.gui.addBinding(target, "wireframe").on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
