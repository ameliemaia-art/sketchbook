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
import { dispose } from "@utils/three/dispose";
import WebGLApp, { GUIWebGLApp } from "../webgl-app";
import {
  columnBaseTuscan,
  ColumnBaseTuscanSettings,
  GUIBaseTuscan,
} from "./column-base-geometry";

type ColumnSettings = {
  base: ColumnBaseTuscanSettings;
};

export default class ColumnForm extends WebGLApp {
  up!: Mesh<ExtrudeGeometry, MeshBasicMaterial>;
  material = new MeshStandardMaterial({
    color: 0xffffff,
    side: DoubleSide,
    wireframe: false,
  });
  wireframeMaterial = new MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    side: DoubleSide,
  });

  columnBase!: Group;

  blueprint: ColumnSettings = {
    base: {
      plinth: {
        height: 5,
        width: 25,
      },
      torus: {
        height: 5,
        radius: 10,
        buldge: 1.25,
        heightSegments: 32,
        radialSegments: 32,
      },
      fillet: {
        height: 1,
        radius: 11.5,
        radialSegments: 32,
      },
    },
  };

  create() {
    this.cameras.main.position.z = 750;
    this.cameras.main.lookAt(0, 0, 0);

    resetCamera(this.cameras.dev, 150, new Vector3(0, 0.5, 1));

    this.settings.helpers = false;
    this.bloomPass.enabled = false;
    this.createLights();
    this.createFloor();

    this.generate();
  }

  createFloor() {
    const width = 150;
    const height = 1;
    const depth = 150;
    const geometry = new BoxGeometry(width, height, depth);

    // Create a material for the floor.
    const material = new MeshStandardMaterial({ color: 0xffffff });

    // Create the mesh.
    const floor = new Mesh(geometry, this.wireframeMaterial);

    // Enable the floor to receive shadows.
    floor.receiveShadow = true;

    floor.position.y = -height / 2;

    this.scene.add(floor);
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
    if (this.columnBase) {
      this.scene.remove(this.columnBase);
    }

    this.columnBase = columnBaseTuscan(
      this.blueprint.base,
      this.wireframeMaterial,
    );
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

    this.controllers.base = new GUIBaseTuscan(this.gui, target.blueprint.base);
    this.controllers.base.addEventListener("change", target.generate);
  }

  onCreate = () => {};
}
/// #endif
