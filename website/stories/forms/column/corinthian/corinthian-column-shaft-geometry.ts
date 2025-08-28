import { Group, Material, Scene } from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import { boundingBox } from "@utils/three/object3d";
import {
  columnShaft,
  ColumnShaft,
  GUIColumnShaft,
} from "../geometry/column-shaft-geometry";

export type CorinthianColumnShaftSettings = ColumnShaft;

export function corinthianColumnShaft(
  settings: CorinthianColumnShaftSettings,
  material: Material,
  scene: Scene,
) {
  const group = new Group();
  group.name = "column-corinthian-shaft";
  const shaft = columnShaft(settings, material, scene);

  group.add(shaft);

  if (settings.helper) {
    group.add(boundingBox(shaft));
  }

  return group;
}

/// #if DEBUG
export class GUICorinthianShaft extends GUIController {
  constructor(
    gui: GUIType,
    public target: CorinthianColumnShaftSettings,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Corinthian Shaft" });

    this.controllers.shaft = new GUIColumnShaft(this.gui, target);
    this.controllers.shaft.addEventListener("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
