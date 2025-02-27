import { Mesh, MeshBasicMaterial, RingGeometry } from "three";

import { GUIType } from "@utils/gui/gui-types";
import WebGLApp, { GUIWebGLApp } from "../webgl-app";

export default class HypatiaSketch extends WebGLApp {
  create() {
    const mesh = new Mesh(
      new RingGeometry(0.95, 1, 32),
      new MeshBasicMaterial({ color: 0xffffff }),
    );
    this.scene.add(mesh);
  }
}

/// #if DEBUG
export class GUIHypatiaSketch extends GUIWebGLApp {
  constructor(gui: GUIType, target: WebGLApp) {
    super(gui, target);
    this.gui = gui;
  }
}
/// #endif
