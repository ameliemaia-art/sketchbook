import {
  AmbientLight,
  DirectionalLight,
  DoubleSide,
  HemisphereLight,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PMREMGenerator,
  Vector3,
} from "three";
import {
  DebugEnvironment,
  RoomEnvironment,
} from "three/examples/jsm/Addons.js";

import { GUIType } from "@utils/gui/gui-types";
import { resetCamera } from "@utils/three/camera";
import WebGLApp, { GUIWebGLApp } from "../webgl-app";

export default class ColumnForm extends WebGLApp {
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

  create() {
    // this.cameras.main.position.z = 750;
    // this.cameras.main.lookAt(0, 0, 0);

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

    const pmremGenerator = new PMREMGenerator(this.renderer);

    const env = pmremGenerator.fromScene(new DebugEnvironment()).texture;

    this.scene.background = env;
    this.scene.backgroundBlurriness = 1;
    this.scene.environment = env;

    // Directional light to cast soft shadows.
    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;

    // Configure shadow properties for the directional light.
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 250;
    directionalLight.shadow.camera.left = -150;
    directionalLight.shadow.camera.right = 150;
    directionalLight.shadow.camera.top = 150;
    directionalLight.shadow.camera.bottom = -150;
    directionalLight.shadow.bias = -0.015;

    this.scene.add(directionalLight);
  }

  generate = () => {};

  dispose() {}
}

/// #if DEBUG
export class GUIColumnForm extends GUIWebGLApp {
  constructor(
    title: string,
    public target: ColumnForm,
  ) {
    super(title, target);
  }
}
/// #endif
