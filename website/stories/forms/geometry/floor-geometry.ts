import { BoxGeometry, CylinderGeometry, Material, Matrix4, Mesh } from "three";

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

export function floorBindings(gui: GUIType, settings: FloorSettings) {
  const folder = gui.addFolder({ title: "Floor" });
  folder.addBinding(settings, "height", { min: 0 });
  folder.addBinding(settings, "width", { min: 0 });
  folder.addBinding(settings, "depth", { min: 0 });
  return folder;
}
