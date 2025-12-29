import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../../sketch/sketch";
import {
  graph,
  QuantumWaveFunctionGraphSettings,
} from "./quantum-wave-function-graph-geometry";

export default class QuantumWaveFunctionGraph extends Sketch {
  settings: SketchSettings & QuantumWaveFunctionGraphSettings = {
    ...sketchSettings,
    darkness: true,
    grid: {
      visible: true,
      divisions: 25,
      opacity: 0.1,
    },
    blueprint: {
      opacity: 1,
      visible: true,
      cosmos: false,
      curve: true,
      curveStrokeWidth: 0.1,
    },
    form: {
      opacity: 1,
      visible: true,
      particles: 1000,
    },
  };

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Wavefunction Probability Density");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    graph(
      this.layers.blueprint,
      this.layers.form,
      center,
      paper.view.size,
      radius,
      this.settings,
    );
  }
}

export class GUIQuantumWaveFunctionGraph extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: QuantumWaveFunctionGraph,
  ) {
    super(gui, target, target.name());

    this.folders.grid = this.addFolder(this.gui, { title: "Grid" });
    this.folders.grid
      .addBinding(target.settings.grid, "visible")
      .on("change", this.draw);
    this.folders.grid
      .addBinding(target.settings.grid, "opacity", {
        min: 0,
        max: 1,
      })
      .on("change", this.draw);

    this.folders.blueprint
      .addBinding(target.settings.blueprint, "curve")
      .on("change", this.draw);
    this.folders.blueprint
      .addBinding(target.settings.blueprint, "curveStrokeWidth", {
        min: 0.1,
        max: 5,
        step: 0.1,
      })
      .on("change", this.draw);

    this.folders.form
      .addBinding(target.settings.form, "particles", {
        min: 100,
        max: 10000,
        step: 1,
      })
      .on("change", this.draw);
  }
}
