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
    dimensions: 3,
    layers: {
      background: false,
      outline: false,
      petals: true,
      circles: true,
      lines: false,
      corners: false,
    },
  };

  draw() {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    this.group?.addChild(flowerOfLife(center, radius, this.settings));
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

    this.gui
      .addBinding(target.settings, "dimensions", {
        min: 1,
        max: 20,
        step: 1,
        index: 3,
      })
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "circles")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "petals")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "lines")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "corners")
      .on("change", this.draw);
  }
}
