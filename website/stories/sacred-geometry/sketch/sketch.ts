import paper from "paper";
import { FolderApi } from "tweakpane";

import { saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";

export type SketchSettings = {
  strokeColor: paper.Color;
  strokeWidth: number;
  scale: number;
  opacity: number;
  layers: { [key: string]: boolean };
};

export const sketchSettings: SketchSettings = {
  scale: 0.85,
  opacity: 1,
  strokeWidth: 1,
  strokeColor: new paper.Color(1, 1, 1, 1),
  layers: {
    background: false,
    outline: false,
  },
};

export default class Sketch {
  settings = sketchSettings;

  group?: paper.Group;

  constructor(public canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    paper.setup(this.canvas);
    this.setup();
  }

  setup(exporting = false) {
    const scale = exporting ? 5 : 1;
    this.settings.strokeWidth = 1 * scale;
    this.canvas.width = 500;
    this.canvas.height = 500;
    paper.view.viewSize = new paper.Size(
      this.canvas.width * scale,
      this.canvas.height * scale,
    );
    requestAnimationFrame(() => this.draw());
  }

  draw() {
    paper.project.activeLayer.removeChildren();

    this.group = new paper.Group();
    this.group.opacity = this.settings.opacity;

    // create a rectangle to fill the background
    if (this.settings.layers.background) {
      const background = new paper.Path.Rectangle(
        paper.view.bounds.topLeft,
        paper.view.bounds.bottomRight,
      );
      background.fillColor = new paper.Color(0, 0, 0);
      this.group.addChild(background);
    }
  }

  name() {
    return "sketch";
  }

  fileName() {
    return this.name().replace(/ /g, "-").toLowerCase();
  }

  saveImage = () => {
    this.setup(true);
    requestAnimationFrame(() => {
      saveImage(this.canvas, this.fileName());
    });
    this.setup(false);
  };

  saveSVG = () => {
    saveSVG(paper.project, this.fileName());
  };
}

export class GUISketch extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: Sketch,
    title: string,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title });

    this.gui
      .addBinding(target.settings, "strokeWidth", { min: 0.1 })
      .on("change", this.draw);
    this.gui
      .addBinding(target.settings, "scale", { min: 0.1, max: 1 })
      .on("change", this.draw);
    this.gui
      .addBinding(target.settings, "opacity", { min: 0, max: 1 })
      .on("change", this.draw);

    this.folders.layers = this.addFolder(this.gui, { title: "Layers" });
    this.folders.layers
      .addBinding(target.settings.layers, "background")
      .on("change", this.draw);

    this.folders.layers
      .addBinding(target.settings.layers, "outline")
      .on("change", this.draw);

    this.gui
      .addButton({ title: "Save Image", label: "" })
      .on("click", target.saveImage);
    this.gui
      .addButton({ title: "Save SVG", label: "" })
      .on("click", target.saveSVG);
  }

  draw = () => {
    this.target.draw();
  };
}
