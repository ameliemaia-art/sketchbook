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
    blueprint: {
      visible: false,
      opacity: 0.5,
      cosmos: true,
      circles: true,
    },
    form: {
      visible: true,
      opacity: 1,
      creation: true,
      triangles: true,
      masculinity: true,
      femininity: true,
      architecture: true,
      dimension0: true,
      dimension1: true,
      dimension2: true,
      dimension3: true,
      dimension4: true,
      dimension5: true,
      union: true,
    },
  };

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    tetrahedron64Star(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
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

    this.folders.blueprint
      .addBinding(target.settings.blueprint, "circles")
      .on("change", this.draw);

    this.folders.form
      .addBinding(target.settings.form, "masculinity")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "femininity")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "architecture")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "dimension0")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "dimension1")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "dimension2")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "dimension3")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "dimension4")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "dimension5")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "union")
      .on("change", this.draw);
  }
}
