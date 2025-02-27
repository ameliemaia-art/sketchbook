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
      visible: true,
      divisions: 25,
      opacity: 0.1,
    },
    blueprint: {
      opacity: 0.25,
      visible: true,
      cosmos: false,
      architecture: true,
    },
    form: {
      opacity: 1,
      visible: true,
      tetrahedron: false,
      hexahedron: false,
      octahedron: false,
      icosahedron: false,
      dodecahedron: true,
    },
  };

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    platonic(
      this.layers.blueprint,
      this.layers.form,
      center,
      paper.view.size,
      radius,
      this.settings,
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

    this.folders.blueprint
      .addBinding(target.settings.blueprint, "architecture")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "hexahedron")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "icosahedron")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "tetrahedron")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "octahedron")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "dodecahedron")
      .on("change", this.draw);
  }
}
