import { Box3, Group, Mesh, Vector3 } from "three";

import { GUIType } from "@utils/gui/gui-types";
import { floor, FloorSettings, GUIFloor } from "../../geometry/floor-geometry";
import { SketchSettings } from "../../webgl-app";
import ColumnForm, { GUIColumnForm } from "../column";
import { GUIColumnShaft } from "../geometry/column-shaft-geometry";
import {
  corinthianColumnBase,
  CorinthianColumnBaseSettings,
} from "./corinthian-column-base-geometry";
import {
  corinthianColumnShaft,
  CorinthianColumnShaftSettings,
} from "./corinthian-column-shaft-geometry";

type ColumnSettings = {
  floor: FloorSettings;
  base: CorinthianColumnBaseSettings;
  shaft: CorinthianColumnShaftSettings;
};

export default class ColumnCorinthianForm extends ColumnForm {
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
    shaft: {
      radius: 8.5,
      height: 50,
      radialSegments: 32,
      flutes: {
        total: 16,
        radius: 1.5,
        height: 45,
        radialSegments: 32,
        capSegments: 16,
        scale: 0.5,
      },
    },
  };

  // Forms
  columnBase!: Group;
  columnShaft!: Group;
  floor!: Mesh;

  constructor() {
    super();
  }

  generate = () => {
    if (this.floor) {
      this.scene.remove(this.floor);
    }
    if (this.columnBase) {
      this.scene.remove(this.columnBase);
    }
    if (this.columnShaft) {
      this.scene.remove(this.columnShaft);
    }

    this.floor = floor(
      this.form.floor,
      this.form.wireframe ? this.wireframeMaterial : this.floorMaterial,
    );

    this.columnBase = corinthianColumnBase(
      this.form.base,
      this.form.wireframe ? this.wireframeMaterial : this.columnMaterial,
    );

    this.columnShaft = corinthianColumnShaft(
      this.form.shaft,
      this.form.wireframe ? this.wireframeMaterial : this.columnMaterial,
      this.scene,
    );

    const box = new Box3();
    box.setFromObject(this.columnBase); // Replace yourObject3D with your actual object
    const size = new Vector3();
    box.getSize(size);

    this.columnShaft.position.y = size.y;

    this.columnBase.traverse((child) => {
      if (child instanceof Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });
    this.columnShaft.traverse((child) => {
      if (child instanceof Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });

    this.scene.add(this.floor);
    this.scene.add(this.columnBase);
    this.scene.add(this.columnShaft);
  };

  dispose() {}
}

/// #if DEBUG
export class GUICorinthianForm extends GUIColumnForm {
  constructor(
    gui: GUIType,
    public target: ColumnCorinthianForm,
  ) {
    super(gui, target);
    this.gui = gui.addFolder({ title: "Corinthian Column" });

    target.addEventListener("create", this.onCreate);

    this.gui.addBinding(target.form, "wireframe").on("change", target.generate);

    // this.controllers.floor = new GUIFloor(this.gui, target.form.floor);
    // this.controllers.floor.addEventListener("change", target.generate);

    // this.controllers.base = new GUICorinthianBase(this.gui, target.form.base);
    // this.controllers.base.addEventListener("change", target.generate);

    this.controllers.shaft = new GUIColumnShaft(this.gui, target.form.shaft);
    this.controllers.shaft.addEventListener("change", target.generate);
  }

  onCreate = () => {};
}
/// #endif
