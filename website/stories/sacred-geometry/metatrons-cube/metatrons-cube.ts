import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  sketchSettings,
  SketchSettings,
} from "../sketch/sketch";
import {
  metatronsCube,
  MetatronsCubeSettings,
} from "./metatrons-cube-geometry";

export default class MetatronsCube extends Sketch {
  settings: SketchSettings & MetatronsCubeSettings = {
    ...sketchSettings,
    blueprint: {
      visible: false,
      opacity: 0.5,
      cosmos: true,
    },
    form: {
      visible: true,
      opacity: 1,
      creation: true,
      architecture: true,
      structure: true,
      masculinity: true,
      femininity: true,
      interconnectedness: true,
    },
  };

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    metatronsCube(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }

  name() {
    return "Metatrons Cube";
  }
}

export class GUIMetatronsCube extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: MetatronsCube,
  ) {
    super(gui, target, target.name());

    this.folders.form
      .addBinding(target.settings.form, "creation")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "architecture")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "structure")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "masculinity")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "femininity")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "interconnectedness")
      .on("change", this.draw);
  }
}
