import { CylinderGeometry, Material, Matrix4, Mesh } from "three";

import { GUIType } from "@utils/gui/gui-types";

export type ColumnFillet = {
  height: number;
  radius: number;
  radialSegments: number;
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
  geometry.applyMatrix4(
    new Matrix4().makeTranslation(0, settings.height / 2, 0),
  );
  return new Mesh(geometry, material);
}

export function columnFilletBindings(gui: GUIType, settings: ColumnFillet) {
  const folder = gui.addFolder({ title: "Column Fillet" });
  folder.addBinding(settings, "height", { min: 0 });
  folder.addBinding(settings, "radius", { min: 0 });
  folder.addBinding(settings, "radialSegments", { min: 3 });
  return folder;
}
