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
    blueprint: {
      visible: false,
      opacity: 0.5,
      cosmos: true,
      circles: false,
    },
    form: {
      visible: true,
      opacity: 1,
      architecture: true,
      multidimensional: true,
      union: true,
    },
  };

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    tetrahedron64(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
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

    this.folders.blueprint
      .addBinding(target.settings.blueprint, "circles")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "architecture")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "multidimensional")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "union")
      .on("change", this.draw);
  }
}
