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
    divisions: 9,
    layers: {
      darkness: false,
      light: false,
      rectangle: true,
      subdivisions: true,
      spiral: true,
    },
  };

  draw() {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;

    this.group?.addChild(goldenRectangle(center, radius, this.settings));
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

    this.gui
      .addBinding(target.settings, "divisions", {
        min: 0,
        max: 10,
        step: 1,
        index: 3,
      })
      .on("change", this.draw);

    this.folders.layers
      .addBinding(target.settings.layers, "rectangle")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "subdivisions")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "spiral")
      .on("change", this.draw);
  }
}
