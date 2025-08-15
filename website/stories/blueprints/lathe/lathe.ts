import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import {
  GUILatheGeometry,
  lathe,
  LatheProfile,
  LatheSettings,
} from "./lathe-geometry";

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
    profile: LatheProfile.Scotia,
  },
  torus: {
    divisions: 25,
    scaleX: 1,
  },
  scotia: {
    divisions: 25,
    bottomLength: 0.8,
    topLength: 0.1,
    bottomHeight: 0.1,
    topHeight: 0.1,
  },
};

export default class Lathe extends Sketch {
  settings: SketchSettings & LatheSettings = latheSettings;

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Lathe");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
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
    public target: Lathe,
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

    this.controllers.lathe = new GUILatheGeometry(this.gui, target.settings);
    this.controllers.lathe.addEventListener("change", this.draw);
  }
}
