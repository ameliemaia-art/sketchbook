import { Group, Mesh } from "three";

import { GUIType } from "@utils/gui/gui-types";
import { floor, FloorSettings, GUIFloor } from "../../geometry/floor-geometry";
import { SketchSettings } from "../../webgl-app";
import ColumnForm, { GUIColumnForm } from "../column";
import {
  doricColumnBase,
  DoricColumnBaseSettings,
  GUIDoricBase,
} from "./doric-column-base-geometry";

type ColumnSettings = {
  floor: FloorSettings;
  base: DoricColumnBaseSettings;
};

export default class ColumnDoricForm extends ColumnForm {
  // Settings
  form: SketchSettings & ColumnSettings = {
    wireframe: false,
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
      torus: {
        height: 2.5,
        radius: 11.5,
        buldge: 1,
        heightSegments: 32,
        radialSegments: 64,
      },
      scotia: {
        topHeight: 0,
        bottomRadius: 11.5,
        topRadius: 8.5,
        bottomHeight: 0,
        height: 3,
        divisions: 25,
        radialSegments: 32,
      },
      torus2: {
        height: 2.5,
        radius: 8.5,
        buldge: 1,
        heightSegments: 32,
        radialSegments: 64,
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

    this.columnBase = doricColumnBase(
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

    this.controllers.base = new GUIDoricBase(this.gui, target.form.base);
    this.controllers.base.addEventListener("change", target.generate);
  }

  onCreate = () => {};
}
/// #endif
