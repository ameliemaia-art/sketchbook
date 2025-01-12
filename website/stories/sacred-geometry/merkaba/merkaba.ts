import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  sketchSettings,
  SketchSettings,
} from "../sketch/sketch";
import { merkaba, MerkabaSettings } from "./merkaba-geometry";

export default class Merkaba extends Sketch {
  settings: SketchSettings & MerkabaSettings = {
    ...sketchSettings,
    divisions: 9,
    layers: {
      darkness: false,
      light: true,
      circles: false,
      masculinity: true,
      femininity: true,
      unity: true,
      interconnectedness: true,
    },
  };

  draw() {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    this.group?.addChild(merkaba(center, radius, this.settings));
  }

  name() {
    return "Merkaba";
  }
}

export class GUIMerkaba extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: Merkaba,
  ) {
    super(gui, target, target.name());

    this.folders.layers
      .addBinding(target.settings.layers, "circles")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "masculinity")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "femininity")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "unity")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "interconnectedness")
      .on("change", this.draw);
  }
}
