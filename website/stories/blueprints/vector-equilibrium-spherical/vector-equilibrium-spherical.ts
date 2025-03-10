import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import {
  vectorEquilibriumSpherical,
  VectorEquilibriumSphericalSettings,
} from "./vector-equilibrium-spherical-geometry";

export default class VectorEquilibriumSpherical extends Sketch {
  settings: SketchSettings & VectorEquilibriumSphericalSettings = {
    ...sketchSettings,
    petalRadius: 2,
    petalOffset: 2,
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
      energy: true,
      architecture0: true,
      architecture1: true,
    },
  };

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Vector Equilibrium Sperical");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    vectorEquilibriumSpherical(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }
}

export class GUIVectorEquilibriumSpherical extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: VectorEquilibriumSpherical,
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
      .addBinding(target.settings.form, "energy")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "architecture0")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "architecture1")
      .on("change", this.draw);
  }
}
