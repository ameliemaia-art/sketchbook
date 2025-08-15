import { Group, Material } from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import {
  columnPlinth,
  ColumnPlinth,
  GUIPlinth,
} from "../geometry/column-plinth-geometry";
import {
  columnTorus,
  ColumnTorus,
  GUITorus,
} from "../geometry/column-torus-geometry";

export type TuscanColumnBaseSettings = {
  plinth: ColumnPlinth;
  torus: ColumnTorus;
};

export function tuscanColumnBase(
  settings: TuscanColumnBaseSettings,
  material: Material,
) {
  const group = new Group();
  group.name = "column-tuscan";
  const plinth = columnPlinth(settings.plinth, material);
  const torus = columnTorus(settings.torus, material);
  torus.position.y = settings.plinth.height;

  group.add(plinth);
  group.add(torus);

  return group;
}

/// #if DEBUG
export class GUITuscanBase extends GUIController {
  constructor(
    gui: GUIType,
    public target: TuscanColumnBaseSettings,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Tuscan Base" });

    this.controllers.plinth = new GUIPlinth(this.gui, target.plinth);
    this.controllers.plinth.addEventListener("change", this.onChange);

    this.controllers.torus = new GUITorus(this.gui, target.torus);
    this.controllers.torus.addEventListener("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
