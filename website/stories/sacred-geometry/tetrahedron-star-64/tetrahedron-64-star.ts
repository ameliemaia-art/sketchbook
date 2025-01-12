import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import {
  tetrahedron64Star,
  Tetrahedron64StarSettings,
} from "./tetrahedron-64-star-geometry";

export default class Tetrahedron64Star extends Sketch {
  settings: SketchSettings & Tetrahedron64StarSettings = {
    ...sketchSettings,
    layers: {
      darkness: false,
      light: false,
      circles: false,
      triangles: true,
      masculinity: true,
      femininity: true,
      structure: true,
      layer0: true,
      layer1: true,
      layer2: true,
      layer3: true,
      layer4: true,
      layer5: true,
      layer6: true,
    },
  };

  draw() {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    this.group?.addChild(tetrahedron64Star(center, radius, this.settings));
  }

  name() {
    return "64 Tetrahedron Star";
  }
}

export class GUITetrahedron64Star extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: Tetrahedron64Star,
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
      .addBinding(target.settings.layers, "structure")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "layer0")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "layer1")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "layer2")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "layer3")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "layer4")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "layer5")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "layer6")
      .on("change", this.draw);
  }
}
