import { Group, Material } from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import {
  columnFillet,
  ColumnFillet,
  GUIFillet,
} from "./column-fillet-geometry";
import {
  columnPlinth,
  ColumnPlinth,
  GUIPlinth,
} from "./column-plinth-geometry";
import {
  columnScotia,
  ColumnScotia,
  GUIScotia,
} from "./column-scotia-geometry";
import { ColumnTorus, columnTorus } from "./column-torus-geometry";

export type ColumnBaseDoricSettings = {
  plinth: ColumnPlinth;
  fillet: ColumnFillet;
  scotia: ColumnScotia;
  torus: ColumnTorus;
};

export function columnBaseDoric(
  settings: ColumnBaseDoricSettings,
  material: Material,
) {
  const group = new Group();
  group.name = "column-tuscan";
  const plinth = columnPlinth(settings.plinth, material);
  const fillet = columnFillet(settings.fillet, material);
  const scotia = columnScotia(settings.scotia, material);
  const torus = columnTorus(settings.torus, material);
  // const fillet2 = columnFillet(settings.fillet2, material);
  fillet.position.y = settings.plinth.height;
  scotia.position.y = settings.plinth.height + settings.fillet.height;
  torus.position.y =
    settings.plinth.height + settings.fillet.height + settings.scotia.height;

  group.add(plinth);
  group.add(fillet);
  group.add(scotia);
  group.add(torus);
  // group.add(fillet2);

  return group;
}

/// #if DEBUG
export class GUIBaseDoric extends GUIController {
  constructor(
    gui: GUIType,
    public target: ColumnBaseDoricSettings,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Doric Base" });

    this.controllers.fillet = new GUIFillet(this.gui, target.fillet);
    this.controllers.fillet.addEventListener("change", this.onChange);

    this.controllers.plinth = new GUIPlinth(this.gui, target.plinth);
    this.controllers.plinth.addEventListener("change", this.onChange);

    this.controllers.scotia = new GUIScotia(this.gui, target.scotia);
    this.controllers.scotia.addEventListener("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
