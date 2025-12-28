import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../../sketch/sketch";
import { graph, GraphSettings } from "./graph-geometry";

export default class Graph extends Sketch {
  settings: SketchSettings & GraphSettings = {
    ...sketchSettings,
    strokeDepthColor: new paper.Color(1, 1, 1, 0.5),
    grid: {
      visible: true,
      divisions: 25,
      opacity: 0.1,
    },
    blueprint: {
      opacity: 1,
      visible: true,
      cosmos: false,
      architecture: true,
    },
    form: {
      opacity: 1,
      visible: true,
    },
  };

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Wavefunction Probability Density");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    graph(
      this.layers.blueprint,
      this.layers.form,
      center,
      paper.view.size,
      radius,
      this.settings,
    );
  }
}

export class GUIGraph extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: Graph,
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
    this.folders.grid = this.addFolder(this.gui, { title: "Grid", index: 5 });
    this.folders.grid
      .addBinding(target.settings.grid, "visible")
      .on("change", this.draw);
    this.folders.grid
      .addBinding(target.settings.grid, "opacity", {
        min: 0,
        max: 1,
      })
      .on("change", this.draw);
  }
}
