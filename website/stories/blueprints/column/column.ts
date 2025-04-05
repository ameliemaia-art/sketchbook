import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  sketchSettings,
  SketchSettings,
} from "../sketch/sketch";
import { column, ColumnSettings } from "./column-geometry";

export default class Column extends Sketch {
  settings: SketchSettings & ColumnSettings = {
    ...sketchSettings,
    darkness: true,
    blueprint: {
      visible: true,
      opacity: 0.5,
      cosmos: true,
    },
    form: {
      visible: true,
      opacity: 1,
      flutes: 12,
      fluteDepth: 0.1,
      fluteGap: 0.02,
      inset: 0.3,
      insetCurveFactor: 0.75,
      debug: false,
    },
  };

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Column");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    column(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }
}

export class GUIColumn extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: Column,
  ) {
    super(gui, target, target.name());

    this.folders.form
      .addBinding(target.settings.form, "flutes", {
        min: 4,
        max: 24,
        step: 1,
      })
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "fluteGap", {
        min: 0,
        max: 1,
      })
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "fluteDepth", {
        min: 0,
        max: 1,
      })
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "inset", {
        min: 0,
        max: 1,
      })
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "insetCurveFactor", {
        min: 0,
        max: 2,
      })
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "debug")
      .on("change", this.draw);
  }
}
