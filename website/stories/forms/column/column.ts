import {
  AmbientLight,
  DirectionalLight,
  DoubleSide,
  HemisphereLight,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  Vector3,
} from "three";

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

  generate = () => {};

  dispose() {}
}

/// #if DEBUG
export class GUIColumnForm extends GUIWebGLApp {
  constructor(
    gui: GUIType,
    public target: ColumnForm,
  ) {
    super(gui, target);
  }
}
/// #endif
