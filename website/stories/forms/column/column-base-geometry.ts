import { Group, Material } from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import {
  columnFillet,
  ColumnFillet,
  columnFilletBindings,
} from "./column-fillet-geometry";
import {
  columnPlinth,
  ColumnPlinth,
  columnPlinthBindings,
} from "./column-plinth-geometry";
import {
  columnTorus,
  ColumnTorus,
  columnTorusBindings,
} from "./column-torus-geometry";

export type ColumnBaseTuscanSettings = {
  plinth: ColumnPlinth;
  fillet: ColumnFillet;
  torus: ColumnTorus;
  fillet2: ColumnFillet;
};

export function columnBaseTuscan(
  settings: ColumnBaseTuscanSettings,
  material: Material,
) {
  const group = new Group();
  group.name = "column-tuscan";
  const plinth = columnPlinth(settings.plinth, material);
  const fillet = columnFillet(settings.fillet, material);
  const torus = columnTorus(settings.torus, material);
  const fillet2 = columnFillet(settings.fillet2, material);
  fillet.position.y = settings.plinth.height;
  torus.position.y = settings.plinth.height + settings.fillet.height;
  fillet2.position.y =
    settings.plinth.height + settings.fillet.height + settings.torus.height;

  group.add(plinth);
  group.add(fillet);
  group.add(torus);
  group.add(fillet2);

  return group;
}

/// #if DEBUG
export class GUIBaseTuscan extends GUIController {
  constructor(
    gui: GUIType,
    public target: ColumnBaseTuscanSettings,
  ) {
    super(gui);
    this.gui = gui;

    this.folders.columnPlinth = columnPlinthBindings(gui, target.plinth).on(
      "change",
      this.onChange,
    );
    this.folders.columnFillet = columnFilletBindings(gui, target.fillet).on(
      "change",
      this.onChange,
    );
    this.folders.columnTorus = columnTorusBindings(gui, target.torus).on(
      "change",
      this.onChange,
    );
    this.folders.columnFillet2 = columnFilletBindings(gui, target.fillet2).on(
      "change",
      this.onChange,
    );
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
