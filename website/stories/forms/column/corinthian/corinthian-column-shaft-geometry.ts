import { Group, Material, Scene } from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import { columnShaft, ColumnShaft } from "../geometry/column-shaft-geometry";

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
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
