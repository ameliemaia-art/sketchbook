import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import { platonic, PlatonicSettings } from "./platonic-geometry";

export default class Platonic extends Sketch {
  settings: SketchSettings & PlatonicSettings = {
    ...sketchSettings,
    strokeDepthColor: new paper.Color(1, 1, 1, 0.5),
    grid: {
      divisions: 25,
      strokeColor: new paper.Color(1, 1, 1, 0.1),
    },
    guide: {
      strokeColor: new paper.Color(1, 1, 1, 0.25),
    },
    layers: {
      darkness: true,
      light: false,
      tetrahedron: false,
      hexahedron: false,
      octahedron: false,
      icosahedron: false,
      dodecahedron: true,
    },
  };

  draw() {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    this.group?.addChild(
      platonic(center, paper.view.size, radius, this.settings),
    );
  }

  name() {
    return "Platonic";
  }
}

export class GUIPlatonic extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: Platonic,
  ) {
    super(gui, target, target.name());

    this.gui
      .addBinding(target.settings.strokeDepthColor, "alpha", {
        label: "strokeDepthColor",
        min: 0,
        max: 1,
        index: 3,
      })
      .on("change", this.draw);

    this.folders.grid = this.addFolder(this.gui, { title: "Grid", index: 4 });
    this.folders.grid
      .addBinding(target.settings.grid.strokeColor, "alpha", {
        min: 0,
        max: 1,
        label: "strokeColor",
      })
      .on("change", this.draw);

    this.folders.guide = this.addFolder(this.gui, { title: "Guide", index: 5 });
    this.folders.guide
      .addBinding(target.settings.guide.strokeColor, "alpha", {
        min: 0,
        max: 1,
        label: "strokeColor",
      })
      .on("change", this.draw);

    this.folders.layers
      .addBinding(target.settings.layers, "hexahedron")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "icosahedron")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "tetrahedron")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "octahedron")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "dodecahedron")
      .on("change", this.draw);
  }
}
