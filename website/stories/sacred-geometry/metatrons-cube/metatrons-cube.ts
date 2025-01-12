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
    layers: {
      darkness: false,
      light: false,
      creation: true,
      structure: true,
      masculinity: true,
      femininity: true,
      interconnectedness: true,
    },
  };

  draw() {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    this.group?.addChild(metatronsCube(center, radius, this.settings));
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

    this.folders.layers
      .addBinding(target.settings.layers, "structure")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "creation")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "masculinity")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "femininity")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "interconnectedness")
      .on("change", this.draw);
  }
}
