import { BoxGeometry, Material, Matrix4, Mesh } from "three";

import { GUIType } from "@utils/gui/gui-types";

export type ColumnPlinth = {
  height: number;
  width: number;
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

export function columnPlinthBindings(gui: GUIType, settings: ColumnPlinth) {
  const folder = gui.addFolder({ title: "Column Plinth" });
  folder.addBinding(settings, "height", { min: 0 });
  folder.addBinding(settings, "width", { min: 0 });
  return folder;
}
