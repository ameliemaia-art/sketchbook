import { Group, Mesh } from "three";

import { GUIType } from "@utils/gui/gui-types";
import { floor, FloorSettings, GUIFloor } from "../geometry/floor-geometry";
import { SketchSettings } from "../webgl-app";
import ColumnForm, { GUIColumnForm } from "./column";
import {
  columnBaseDoric,
  ColumnBaseDoricSettings,
  GUIBaseDoric,
} from "./geometry/column-base-doric-geometry";

type ColumnSettings = {
  floor: FloorSettings;
  base: ColumnBaseDoricSettings;
};

export default class ColumnDoricForm extends ColumnForm {
  // Settings
  form: SketchSettings & ColumnSettings = {
    wireframe: true,
    floor: {
      width: 150,
      height: 1,
      depth: 150,
    },
    base: {
      plinth: {
        height: 5,
        width: 25,
        widthSegments: 1,
        heightSegments: 1,
        depthSegments: 1,
      },
      fillet: {
        height: 2.5,
        radius: 11.5,
        radialSegments: 64,
      },
      scotia: {
        height: 5,
        width: 25,
        widthSegments: 1,
        heightSegments: 1,
        depthSegments: 1,
      },
    },
  };

  // Forms
  columnBase!: Group;
  floor!: Mesh;

  generate = () => {
    if (this.floor) {
      this.scene.remove(this.floor);
    }
    if (this.columnBase) {
      this.scene.remove(this.columnBase);
    }

    this.floor = floor(
      this.form.floor,
      this.form.wireframe ? this.wireframeMaterial : this.floorMaterial,
    );

    this.columnBase = columnBaseDoric(
      this.form.base,
      this.form.wireframe ? this.wireframeMaterial : this.columnMaterial,
    );

    this.columnBase.traverse((child) => {
      if (child instanceof Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });

    this.scene.add(this.floor);
    this.scene.add(this.columnBase);
  };

  dispose() {}
}

/// #if DEBUG
export class GUIColumnDoricForm extends GUIColumnForm {
  constructor(
    gui: GUIType,
    public target: ColumnDoricForm,
  ) {
    super(gui, target);
    this.gui = gui.addFolder({ title: "Doric Column" });

    target.addEventListener("create", this.onCreate);

    this.gui.addBinding(target.form, "wireframe").on("change", target.generate);

    this.controllers.floor = new GUIFloor(this.gui, target.form.floor);
    this.controllers.floor.addEventListener("change", target.generate);

    this.controllers.base = new GUIBaseDoric(this.gui, target.form.base);
    this.controllers.base.addEventListener("change", target.generate);
  }

  onCreate = () => {};
}
/// #endif
