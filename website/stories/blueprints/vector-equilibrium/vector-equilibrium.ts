import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  sketchSettings,
  SketchSettings,
} from "../sketch/sketch";
import {
  vectorEquilibrium,
  VectorEquilibriumSettings,
} from "./vector-equilibrium-geometry";

export default class VectorEquilibrium extends Sketch {
  settings: SketchSettings & VectorEquilibriumSettings = {
    ...sketchSettings,
    blueprint: {
      visible: false,
      opacity: 0.5,
      cosmos: true,
      creation: true,
      circles: true,
    },
    form: {
      visible: true,
      opacity: 1,
      structure: true,
      architecture0: true,
      architecture1: true,
      architecture2: true,
      union: true,
    },
  };

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Vector Equilibrium");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    vectorEquilibrium(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }
}

export class GUIVectorEquilibrium extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: VectorEquilibrium,
  ) {
    super(gui, target, target.name());

    this.folders.blueprint
      .addBinding(target.settings.blueprint, "creation")
      .on("change", this.draw);
    this.folders.blueprint
      .addBinding(target.settings.blueprint, "circles")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "structure")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "architecture0")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "architecture1")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "architecture2")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "union")
      .on("change", this.draw);
  }
}
