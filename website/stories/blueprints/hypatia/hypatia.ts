import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import { hypatia, HypatiaSettings } from "./hypatia-geometry";

export default class Hypatia extends Sketch {
  settings: SketchSettings & HypatiaSettings = {
    ...sketchSettings,
    scale: 0.85,
    blueprint: {
      visible: true,
      opacity: 0.5,
      cosmos: false,
    },
    form: {
      visible: true,
      opacity: 1,
      outline: true,
      earth: true,
      planets: false,
      planetsMaxRotation: 1.75,
    },
  };

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    hypatia(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }

  name() {
    return "Hypatia";
  }
}

export class GUIHypatia extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: Hypatia,
  ) {
    super(gui, target, target.name());

    this.folders.form
      .addBinding(target.settings.form, "outline")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "earth")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "planets")
      .on("change", this.draw);

    this.folders.form
      .addBinding(target.settings.form, "planetsMaxRotation", {
        min: 0,
        max: 10,
      })
      .on("change", this.draw);
  }
}

/**
 * Motion of planets around the center
 *
 *
 */
