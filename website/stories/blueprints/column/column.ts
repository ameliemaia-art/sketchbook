import paper from "paper";
import { FolderApi } from "tweakpane";

import { GUIType } from "@utils/gui/gui-types";
import Sketch, {
  GUISketch,
  sketchSettings,
  SketchSettings,
} from "../sketch/sketch";
import { column, ColumnSettings } from "./column-geometry";

export const ColumnDefaultSettings: SketchSettings & ColumnSettings = {
  ...sketchSettings,
  darkness: true,
  blueprint: {
    visible: false,
    opacity: 0.5,
    cosmos: true,
  },
  form: {
    visible: true,
    opacity: 1,
    flutes: 12,
    inset: 0.15,
    insetCurveLength: 0.65,
    debug: false,
  },
  grid: {
    visible: true,
    divisions: 25,
    opacity: 0.1,
  },
};

export default class Column extends Sketch {
  settings = ColumnDefaultSettings;
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
      paper.view.size,
      radius,
      this.settings,
    );
  }
}

export class GUIColumn extends GUISketch {
  constructor(
    gui: GUIType,
    public target: Column,
    onChange: () => void = () => {},
  ) {
    super(gui, target, target.name());

    columnBindings(this.folders.form, target.settings, () => {
      this.target.draw();
      onChange();
    });

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

export function columnBindings(
  gui: GUIType,
  settings: ColumnSettings,
  onChange: () => void = () => {},
) {
  gui
    .addBinding(settings.form, "flutes", {
      min: 4,
      max: 24,
      step: 1,
    })
    .on("change", onChange);
  gui
    .addBinding(settings.form, "inset", {
      min: 0,
      max: 1,
    })
    .on("change", onChange);
  gui
    .addBinding(settings.form, "insetCurveLength", {
      min: 0,
      max: 1,
    })
    .on("change", onChange);
  gui.addBinding(settings.form, "debug").on("change", onChange);
}
