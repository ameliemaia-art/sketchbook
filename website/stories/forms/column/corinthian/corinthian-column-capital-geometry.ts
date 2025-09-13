import { AxesHelper, Box3, Box3Helper, Group, Material, Vector3 } from "three";

import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import { addAndStack, boundingBox } from "@utils/three/object3d";
import {
  ColumnAbacus,
  columnAbacus,
  GUIAbacus,
} from "../geometry/column-abacus-geometry";
import {
  ColumnAcanthus,
  columnAcanthusTier,
  columnAcanthusVolute,
  GUIAcanthus,
} from "../geometry/column-acanthus-geometry";
import {
  columnEchinus,
  ColumnEchinus,
  GUIEchinus,
} from "../geometry/column-echinus-geometry";
import {
  ColumnTorus,
  columnTorus,
  GUITorus,
} from "../geometry/column-torus-geometry";
import {
  columnVolute,
  ColumnVolute,
  GUIVolute,
} from "../geometry/column-volute-geometry";

export type CorinthianColumnCaptitalSettings = {
  necking: ColumnEchinus;
  torus: ColumnTorus;
  echinus: ColumnEchinus;
  abacus: ColumnAbacus;
  acanthus: ColumnAcanthus;
  volute: ColumnVolute;
};

export function corinthianColumnCapital(
  settings: CorinthianColumnCaptitalSettings,
  material: Material,
) {
  const group = new Group();

  // group.add(new AxesHelper());
  group.name = "column-corinthian-captital";
  const necking = columnEchinus(settings.necking, material);
  necking.name = "necking";
  const torus = columnTorus(settings.torus, material);
  torus.name = "torus";
  const echinus = columnEchinus(settings.echinus, material);
  echinus.name = "echinus";
  // const abacus = columnAbacus(settings.abacus, material);
  // abacus.name = "abacus";
  const acanthusBase = columnAcanthusTier(
    settings.acanthus,
    settings.acanthus.base,
    material,
  );
  acanthusBase.name = "acanthus-base";
  const acanthusMiddle = columnAcanthusTier(
    settings.acanthus,
    settings.acanthus.middle,
    material,
  );
  acanthusMiddle.name = "acanthus-middle";

  const acanthusVolute = columnAcanthusVolute(
    settings.acanthus,
    settings.acanthus.volute.corner,
    settings.acanthus.volute.center,
    material,
  );
  acanthusVolute.name = "acanthus-volute";

  const volute = columnVolute(settings.volute, material);
  volute.name = "volute";

  // if (settings.necking.helper) {
  //   group.add(boundingBox(necking));
  // }

  // if (settings.torus.helper) {
  //   group.add(boundingBox(torus));
  // }

  // if (settings.echinus.helper) {
  //   group.add(boundingBox(echinus));
  // }

  // if (settings.abacus.helper) {
  //   group.add(boundingBox(abacus));
  // }

  // if (settings.acanthus.helper) {
  //   group.add(boundingBox(acanthusBase));
  //   group.add(boundingBox(acanthusMiddle));
  //   group.add(boundingBox(acanthusTop));
  // }

  addAndStack(group, necking, torus, echinus);
  group.add(acanthusBase);
  group.add(acanthusMiddle);
  group.add(acanthusVolute);
  group.add(volute);
  acanthusBase.position.y = echinus.position.y;
  acanthusMiddle.position.y = echinus.position.y;
  acanthusVolute.position.y = echinus.position.y;

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

    this.controllers.abacus = new GUIAbacus(this.gui, target.abacus);
    this.controllers.abacus.addEventListener("change", this.onChange);

    this.controllers.acanthusBase = new GUIAcanthus(
      this.gui,
      target.acanthus,
      target.acanthus.base,
    );
    this.controllers.acanthusBase.addEventListener("change", this.onChange);

    this.controllers.acanthusMiddle = new GUIAcanthus(
      this.gui,
      target.acanthus,
      target.acanthus.middle,
    );
    this.controllers.acanthusMiddle.addEventListener("change", this.onChange);

    this.controllers.volute = new GUIVolute(this.gui, target.volute);
    this.controllers.volute.addEventListener("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
