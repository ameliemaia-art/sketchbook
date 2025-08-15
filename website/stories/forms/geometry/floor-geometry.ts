import { BoxGeometry, CylinderGeometry, Material, Matrix4, Mesh } from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";

export type FloorSettings = {
  width: number;
  height: number;
  depth: number;
};

export function floor(settings: FloorSettings, material: Material) {
  const geometry = new BoxGeometry(
    settings.width,
    settings.height,
    settings.depth,
  );
  geometry.applyMatrix4(
    new Matrix4().makeTranslation(0, -settings.height / 2, 0),
  );
  const mesh = new Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}

/// #if DEBUG
export class GUIFloor extends GUIController {
  constructor(
    gui: GUIType,
    public target: FloorSettings,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Floor" });
    this.gui.addBinding(target, "height", { min: 0 });
    this.gui
      .addBinding(target, "width", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "depth", { min: 0 })
      .on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
