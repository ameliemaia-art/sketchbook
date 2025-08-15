import paper from "paper";
import { FolderApi } from "tweakpane";

import mathSeeded from "@utils/math-seeded";
import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import { lathe, LatheSettings } from "./lathe-geometry";

export const latheSettings: SketchSettings & LatheSettings = {
  ...sketchSettings,
  scale: 1,
  darkness: true,
  grid: {
    visible: true,
    divisions: 25,
    opacity: 0.1,
  },
  blueprint: {
    visible: true,
    opacity: 0.5,
    cosmos: false,
  },
  form: {
    visible: true,
    opacity: 1,
    outline: true,
  },
  lathe: {
    height: 1,
    divisions: 25,
    scaleX: 1,
  },
};

export default class Hypatia extends Sketch {
  settings: SketchSettings & LatheSettings = latheSettings;

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Hypatia");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    mathSeeded.setSeed(this.settings.seed);

    lathe(
      this.layers.blueprint,
      this.layers.form,
      center,
      paper.view.size,
      radius,
      this.settings,
    );
  }
}

export class GUILathe extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: Hypatia,
  ) {
    super(gui, target, target.name());

    this.folders.form
      .addBinding(target.settings.form, "outline")
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

    this.folders.lathe = this.addFolder(this.folders.form, {
      title: "lathe",
    });
    this.folders.lathe
      .addBinding(target.settings.lathe, "height", {
        min: 0,
        max: 1,
      })
      .on("change", this.draw);
    this.folders.lathe
      .addBinding(target.settings.lathe, "divisions", {
        min: 1,
        max: 100,
      })
      .on("change", this.draw);
    this.folders.lathe
      .addBinding(target.settings.lathe, "scaleX", {
        min: 0,
        max: 2,
      })
      .on("change", this.draw);
  }
}
