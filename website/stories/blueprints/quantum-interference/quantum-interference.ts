import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import {
  quantumInterference,
  QuantumInterferenceSettings,
} from "./quantum-interference-geometry";

export default class QuantumInterference extends Sketch {
  settings: SketchSettings & QuantumInterferenceSettings = {
    ...sketchSettings,
    blueprint: {
      visible: false,
      opacity: 0.5,
      cosmos: true,
    },
    form: {
      visible: true,
      opacity: 1,
    },
  };

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Quantum Interference");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    quantumInterference(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }
}

export class GUIQuantumInterference extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: QuantumInterference,
  ) {
    super(gui, target, target.name());
  }
}
