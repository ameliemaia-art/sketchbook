import { Group, Material } from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import { stack } from "@utils/three/object3d";
import {
  columnEchinus,
  ColumnEchinus,
  GUIEchinus,
} from "../geometry/column-echinus-geometry";
import { ColumnScotia, columnScotia } from "../geometry/column-scotia-geometry";
import {
  ColumnTorus,
  columnTorus,
  GUITorus,
} from "../geometry/column-torus-geometry";

export type CorinthianColumnCaptitalSettings = {
  necking: ColumnEchinus;
  torus: ColumnTorus;
  echinus: ColumnEchinus;
};

export function corinthianColumnCapital(
  settings: CorinthianColumnCaptitalSettings,
  material: Material,
) {
  const group = new Group();
  group.name = "column-corinthian-captital";
  const scotia = columnEchinus(settings.necking, material);
  const torus = columnTorus(settings.torus, material);
  const echinus = columnEchinus(settings.echinus, material);
  // const torus2 = columnTorus(settings.torus2, material);
  // torus.position.y = settings.plinth.height;
  // scotia.position.y = settings.plinth.height + settings.torus.height;
  // torus2.position.y =
  //   settings.plinth.height + settings.torus2.height + settings.scotia.height;

  stack(scotia, torus);
  stack(torus, echinus);

  group.add(scotia);
  group.add(torus);
  group.add(echinus);
  // group.add(scotia);
  // group.add(torus2);

  return group;
}

/// #if DEBUG
export class GUICorinthianCapital extends GUIController {
  constructor(
    gui: GUIType,
    public target: CorinthianColumnCaptitalSettings,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Corinthian Captital" });

    this.controllers.necking = new GUIEchinus(
      this.gui,
      target.necking,
      "Necking",
    );
    this.controllers.necking.addEventListener("change", this.onChange);

    this.controllers.torus = new GUITorus(this.gui, target.torus);
    this.controllers.torus.addEventListener("change", this.onChange);

    this.controllers.echinus = new GUIEchinus(this.gui, target.echinus);
    this.controllers.echinus.addEventListener("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
