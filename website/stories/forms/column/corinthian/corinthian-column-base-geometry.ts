import { Group, Material } from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import {
  columnPlinth,
  ColumnPlinth,
  GUIPlinth,
} from "../geometry/column-plinth-geometry";
import {
  columnScotia,
  ColumnScotia,
  GUIScotia,
} from "../geometry/column-scotia-geometry";
import {
  ColumnTorus,
  columnTorus,
  GUITorus,
} from "../geometry/column-torus-geometry";

export type CorinthianColumnBaseSettings = {
  plinth: ColumnPlinth;
  torus: ColumnTorus;
  scotia: ColumnScotia;
  torus2: ColumnTorus;
};

export function corinthianColumnBase(
  settings: CorinthianColumnBaseSettings,
  material: Material,
) {
  const group = new Group();
  group.name = "column-corinthian";
  const plinth = columnPlinth(settings.plinth, material);
  const torus = columnTorus(settings.torus, material);
  const scotia = columnScotia(settings.scotia, material);
  const torus2 = columnTorus(settings.torus2, material);
  torus.position.y = settings.plinth.height;
  scotia.position.y = settings.plinth.height + settings.torus.height;
  torus2.position.y =
    settings.plinth.height + settings.torus2.height + settings.scotia.height;

  group.add(plinth);
  group.add(torus);
  group.add(scotia);
  group.add(torus2);

  return group;
}

/// #if DEBUG
export class GUICorinthianBase extends GUIController {
  constructor(
    gui: GUIType,
    public target: CorinthianColumnBaseSettings,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Corinthian Base" });

    this.controllers.plinth = new GUIPlinth(this.gui, target.plinth);
    this.controllers.plinth.addEventListener("change", this.onChange);

    this.controllers.torus = new GUITorus(this.gui, target.torus);
    this.controllers.torus.addEventListener("change", this.onChange);

    this.controllers.scotia = new GUIScotia(this.gui, target.scotia);
    this.controllers.scotia.addEventListener("change", this.onChange);

    this.controllers.torus2 = new GUITorus(this.gui, target.torus2);
    this.controllers.torus2.addEventListener("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
