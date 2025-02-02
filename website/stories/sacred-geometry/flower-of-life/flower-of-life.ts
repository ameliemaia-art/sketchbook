import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import { flowerOfLife, FlowerOfLifeSettings } from "./flower-of-life-geometry";

export default class FlowerOfLife extends Sketch {
  settings: SketchSettings & FlowerOfLifeSettings = {
    ...sketchSettings,
    blueprint: {
      visible: false,
      opacity: 0.5,
      cosmos: true,
      structure: true,
      lines: true,
    },
    form: {
      visible: true,
      opacity: 1,
      dimensions: 3,
      petals: true,
      circles: true,
    },
  };

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    flowerOfLife(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }

  name() {
    return "Flower Of Life";
  }
}

export class GUIFlowerOfLife extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: FlowerOfLife,
  ) {
    super(gui, target, target.name());

    this.folders.blueprint
      .addBinding(target.settings.blueprint, "structure")
      .on("change", this.draw);
    this.folders.blueprint
      .addBinding(target.settings.blueprint, "lines")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "dimensions", {
        min: 1,
        max: 20,
        step: 1,
        index: 3,
      })
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "circles")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "petals")
      .on("change", this.draw);
  }
}
