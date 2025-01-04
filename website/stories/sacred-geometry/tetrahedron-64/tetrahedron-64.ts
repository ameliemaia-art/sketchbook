import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  sketchSettings,
  SketchSettings,
} from "../sketch/sketch";
import {
  tetrahedron64,
  Tetrahedron64Settings,
} from "./tetrahedron-64-geometry";

export default class Tetrahedron64 extends Sketch {
  settings: SketchSettings & Tetrahedron64Settings = {
    ...sketchSettings,
    layers: {
      background: false,
      outline: false,
      circles: false,
      triangles: true,
      hexagon: true,
      layer0: true,
      layer1: true,
      layer2: true,
      layer3: true,
      layer4: true,
      layer5: true,
    },
  };

  draw() {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    this.group?.addChild(tetrahedron64(center, radius, this.settings));
  }

  name() {
    return "64 Tetrahedron";
  }
}

export class GUITetrahedron64 extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: Tetrahedron64,
  ) {
    super(gui, target, target.name());

    this.folders.layers
      .addBinding(target.settings.layers, "circles")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "triangles")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "hexagon")
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
  }
}
