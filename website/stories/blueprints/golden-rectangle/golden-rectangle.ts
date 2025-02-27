import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  sketchSettings,
  SketchSettings,
} from "../sketch/sketch";
import {
  goldenRectangle,
  GoldenRectangleSettings,
} from "./golden-rectangle-geometry";

export default class GoldenRectangle extends Sketch {
  settings: SketchSettings & GoldenRectangleSettings = {
    ...sketchSettings,
    blueprint: {
      visible: false,
      opacity: 0.5,
      cosmos: true,
    },
    form: {
      visible: true,
      opacity: 1,
      divisions: 9,
      rectangle: true,
      subdivide: true,
      spiral: true,
    },
  };

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    goldenRectangle(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }

  name() {
    return "Golden Rectangle";
  }
}

export class GUIGoldenRectangle extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: GoldenRectangle,
  ) {
    super(gui, target, target.name());

    this.folders.form
      .addBinding(target.settings.form, "divisions", {
        min: 0,
        max: 10,
        step: 1,
        index: 3,
      })
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "rectangle")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "subdivide")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "spiral")
      .on("change", this.draw);
  }
}
