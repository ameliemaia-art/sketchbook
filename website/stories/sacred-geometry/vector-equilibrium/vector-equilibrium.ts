import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  sketchSettings,
  SketchSettings,
} from "../sketch/sketch";
import {
  vectorEquilibrium,
  VectorEquilibriumSettings,
} from "./vector-equilibrium-geometry";

export default class VectorEquilibrium extends Sketch {
  settings: SketchSettings & VectorEquilibriumSettings = {
    ...sketchSettings,
    layers: {
      darkness: false,
      light: false,
      circles: false,
      structure: true,
      layer0: true,
      layer1: true,
      layer2: true,
      layer3: true,
    },
  };

  draw() {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    this.group?.addChild(vectorEquilibrium(center, radius, this.settings));
  }

  name() {
    return "Vector Equilibrium";
  }
}

export class GUIVectorEquilibrium extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: VectorEquilibrium,
  ) {
    super(gui, target, target.name());

    this.folders.layers
      .addBinding(target.settings.layers, "circles")
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
  }
}
