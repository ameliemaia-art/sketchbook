import { Box3, Group, Mesh, Object3D, Vector3 } from "three";

import { GUIType } from "@utils/editor/gui/gui-types";
import { addAndStack, stack } from "@utils/three/object3d";
import acanthusPath from "../../../blueprints/path-profile/data/acanthus-settings.json";
import { floor, FloorSettings, GUIFloor } from "../../geometry/floor-geometry";
import { GUIWebGLApp } from "../../webgl-app";
import ColumnForm, { GUIColumnForm } from "../column";
import {
  corinthianColumnBase,
  CorinthianColumnBaseSettings,
  GUICorinthianBase,
} from "./corinthian-column-base-geometry";
import {
  corinthianColumnCapital,
  CorinthianColumnCaptitalSettings,
  GUICorinthianCapital,
} from "./corinthian-column-capital-geometry";
import {
  corinthianColumnShaft,
  CorinthianColumnShaftSettings,
  GUICorinthianShaft,
} from "./corinthian-column-shaft-geometry";

type ColumnSettings = {
  floor: FloorSettings;
  base: CorinthianColumnBaseSettings;
  shaft: CorinthianColumnShaftSettings;
  captital: CorinthianColumnCaptitalSettings;
};

const CREATE_BASE = false;
const CREATE_SHAFT = false;
const CREATE_CAPITAL = true;

export default class ColumnCorinthianForm extends ColumnForm {
  // Settings
  form: ColumnSettings = {
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
        helper: true,
        wireframe: false,
      },
      torus: {
        height: 2.5,
        radius: 11.5,
        buldge: 1,
        heightSegments: 32,
        radialSegments: 64,
        helper: true,
        wireframe: false,
      },
      scotia: {
        topHeight: 0,
        bottomRadius: 11.5,
        topRadius: 8.5,
        bottomHeight: 0,
        height: 3,
        divisions: 25,
        radialSegments: 32,
        helper: true,
        wireframe: false,
      },
      torus2: {
        height: 2.5,
        radius: 8.5,
        buldge: 1,
        heightSegments: 32,
        radialSegments: 64,
        helper: true,
        wireframe: false,
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
      helper: true,
      wireframe: false,
    },
    captital: {
      necking: {
        topHeight: 0.5,
        bottomRadius: 8.5,
        topRadius: 11.5,
        bottomHeight: 0,
        height: 5,
        divisions: 25,
        radialSegments: 32,
        helper: true,
        wireframe: false,
      },
      torus: {
        height: 2.5,
        radius: 11.5,
        buldge: 1.25,
        heightSegments: 32,
        radialSegments: 64,
        helper: true,
        wireframe: false,
      },
      echinus: {
        topHeight: 0.5,
        bottomRadius: 8.5,
        topRadius: 15,
        bottomHeight: 0,
        height: 15,
        divisions: 25,
        radialSegments: 32,
        helper: true,
        wireframe: false,
      },
      abacus: {
        height: 5,
        width: 25,
        widthSegments: 1,
        heightSegments: 1,
        depthSegments: 1,
        helper: true,
        wireframe: false,
      },
      acanthus: {
        path: acanthusPath,
        helper: true,
        wireframe: true,
        taperMode: "sine",
      },
    },
  };

  // Previous settings for change tracking
  private previousSettings: Partial<ColumnSettings> = {};

  // Forms
  column = new Group();
  columnBase!: Group;
  columnShaft!: Group;
  columnCapital!: Group;
  floor!: Mesh;

  constructor() {
    super();
    this.column.name = "Corinthium Column";
    this.scene.add(this.column);
  }

  /**
   * Deep compare two objects to detect changes
   */
  private hasChanged<T>(current: T, previous: T | undefined): boolean {
    if (!previous) return true;
    return JSON.stringify(current) !== JSON.stringify(previous);
  }

  /**
   * Update stored settings for a component
   */
  private updateStoredSettings<K extends keyof ColumnSettings>(
    key: K,
    settings: ColumnSettings[K],
  ) {
    this.previousSettings[key] = JSON.parse(JSON.stringify(settings));
  }

  generate = () => {
    if (this.floor) {
      this.scene.remove(this.floor);
    }
    if (this.columnBase) {
      this.column.remove(this.columnBase);
    }
    if (this.columnShaft) {
      this.column.remove(this.columnShaft);
    }
    if (this.columnCapital) {
      this.column.remove(this.columnCapital);
    }

    this.floor = floor(this.form.floor, this.floorMaterial);

    if (CREATE_BASE) {
      this.columnBase = corinthianColumnBase(
        this.form.base,
        this.columnMaterial,
      );
      this.enableShadows(this.columnBase);
    }

    if (CREATE_SHAFT) {
      this.columnShaft = corinthianColumnShaft(
        this.form.shaft,
        this.columnMaterial,
        this.scene,
      );
      this.enableShadows(this.columnShaft);
    }

    if (CREATE_CAPITAL) {
      this.columnCapital = corinthianColumnCapital(
        this.form.captital,
        this.columnMaterial,
      );
      this.enableShadows(this.columnCapital);
    }
    addAndStack(
      this.column,
      this.columnBase,
      this.columnShaft,
      this.columnCapital,
    );

    // this.scene.add(this.floor);
  };

  enableShadows(object: Object3D) {
    object.traverse((child) => {
      if (child instanceof Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });
  }

  dispose() {}
}

/// #if DEBUG
export class GUICorinthianForm extends GUIWebGLApp {
  constructor(
    title: string,
    public target: ColumnCorinthianForm,
  ) {
    super(title, target);

    this.folders.sketch = this.gui.addFolder({ title: "Corinthian Column" });

    target.addEventListener("create", this.onCreate);

    // this.controllers.floor = new GUIFloor(this.gui, target.form.floor);
    // this.controllers.floor.addEventListener("change", target.generate);

    if (CREATE_BASE) {
      this.controllers.base = new GUICorinthianBase(
        this.folders.sketch,
        target.form.base,
      );
      this.controllers.base.addEventListener("change", target.generate);
    }

    if (CREATE_SHAFT) {
      this.controllers.shaft = new GUICorinthianShaft(
        this.folders.sketch,
        target.form.shaft,
      );
      this.controllers.shaft.addEventListener("change", target.generate);
    }

    if (CREATE_CAPITAL) {
      this.controllers.shaft = new GUICorinthianCapital(
        this.folders.sketch,
        target.form.captital,
      );
      this.controllers.shaft.addEventListener("change", target.generate);
    }
  }

  onCreate = () => {};
}
/// #endif
