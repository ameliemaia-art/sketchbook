import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import {
  vectorEquilibriumSpherical,
  VectorEquilibriumSphericalSettings,
} from "./vector-equilibrium-spherical-geometry";

export default class VectorEquilibriumSpherical extends Sketch {
  settings: SketchSettings & VectorEquilibriumSphericalSettings = {
    ...sketchSettings,
    petalRadius: 2,
    petalOffset: 2,
    layers: {
      background: false,
      outline: false,
      circles: false,
      structure: true,
      layer0: true,
      layer1: true,
      layer2: true,
    },
  };

  draw = () => {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    this.group?.addChild(
      vectorEquilibriumSpherical(center, radius, this.settings),
    );
  };

  name() {
    return "Vector Equilibrium Spherical";
  }
}

export class GUIVectorEquilibriumSpherical extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: VectorEquilibriumSpherical,
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
  }
}
