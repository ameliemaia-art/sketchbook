import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  Vector2,
  Vector3,
} from "three";

import { GUIType } from "@utils/gui/gui-types";
import { resetCamera } from "@utils/three/camera";
import {
  floor,
  floorBindings,
  FloorSettings,
} from "../geometry/floor-geometry";
import WebGLApp, { GUIWebGLApp } from "../webgl-app";
import {
  columnBaseTuscan,
  ColumnBaseTuscanSettings,
  GUIBaseTuscan,
} from "./column-base-geometry";

type ColumnSettings = {
  floor: FloorSettings;
  base: ColumnBaseTuscanSettings;
};

type SketchSettings = {
  wireframe: boolean;
};

export default class ColumnForm extends WebGLApp {
  up!: Mesh<ExtrudeGeometry, MeshBasicMaterial>;
  columnMaterial = new MeshStandardMaterial({
    color: 0xffffff,
    side: DoubleSide,
    wireframe: false,
  });
  floorMaterial = new MeshStandardMaterial({
    color: 0xcccccc,
    side: DoubleSide,
    wireframe: false,
  });
  wireframeMaterial = new MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    side: DoubleSide,
  });

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
      fillet: {
        height: 2.5,
        radius: 11.5,
        radialSegments: 64,
      },
      torus: {
        height: 2.5,
        radius: 10.5,
        buldge: 1,
        heightSegments: 32,
        radialSegments: 64,
        profileSharpness: 1.5,
        verticalCompression: 0.5,
      },
      fillet2: {
        height: 1.25,
        radius: 10,
        radialSegments: 64,
      },
    },
  };

  columnBase!: Group;
  floor!: Mesh;

  create() {
    this.cameras.main.position.z = 750;
    this.cameras.main.lookAt(0, 0, 0);

    resetCamera(this.cameras.dev, 150, new Vector3(0, 0.5, 1));

    this.settings.helpers = false;
    this.bloomPass.enabled = false;
    this.createLights();

    this.generate();
  }

  createLights() {
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.shadowMap.needsUpdate = true;
    this.renderer.shadowMap.autoUpdate = true;

    // Soft ambient light for overall illumination.
    const ambientLight = new AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Hemisphere light for natural outdoor lighting (sky and ground).
    const hemisphereLight = new HemisphereLight(0xbfd1e5, 0xf5f5f5, 0.6);
    this.scene.add(hemisphereLight);

    // Directional light to cast soft shadows.
    const directionalLight = new DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;

    // Configure shadow properties for the directional light.
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 250;
    // Optionally adjust the shadow camera frustum for better shadow coverage.
    directionalLight.shadow.camera.left = -150;
    directionalLight.shadow.camera.right = 150;
    directionalLight.shadow.camera.top = 150;
    directionalLight.shadow.camera.bottom = -150;
    directionalLight.shadow.bias = -0.015;

    this.scene.add(directionalLight);
  }

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

    this.columnBase = columnBaseTuscan(
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
export class GUIColumnForm extends GUIWebGLApp {
  constructor(
    gui: GUIType,
    public target: ColumnForm,
  ) {
    super(gui, target);
    this.gui = gui.addFolder({ title: "Column" });

    target.addEventListener("create", this.onCreate);

    this.gui.addBinding(target.form, "wireframe").on("change", target.generate);

    this.folders.floor = floorBindings(this.gui, target.form.floor).on(
      "change",
      target.generate,
    );

    this.controllers.base = new GUIBaseTuscan(this.gui, target.form.base);
    this.controllers.base.addEventListener("change", target.generate);
  }

  onCreate = () => {};
}
/// #endif
