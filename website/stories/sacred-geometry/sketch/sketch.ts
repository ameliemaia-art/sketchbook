import paper from "paper";
import { FolderApi } from "tweakpane";

import { saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";

export type SketchSettings = {
  strokeColor: paper.Color;
  strokeWidth: number;
  scale: number;
  opacity: number;
  darkness: boolean;
  blueprint: { [key: string]: unknown };
  form: { [key: string]: unknown };
};

export const sketchSettings: SketchSettings = {
  scale: 0.85,
  opacity: 1,
  strokeWidth: 1,
  strokeColor: new paper.Color(1, 1, 1, 1),
  darkness: false,
  blueprint: {
    opacity: 0.5,
    visible: false,
    cosmos: false,
  },
  form: {
    opacity: 1,
    visible: true,
  },
};

export default class Sketch {
  settings = sketchSettings;

  group?: paper.Group;
  layers: { blueprint: paper.Group; form: paper.Group } = {};

  constructor(public canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    paper.setup(this.canvas);
    this.setup();
  }

  async setup(exporting = false) {
    return new Promise<void>((resolve) => {
      const scale = exporting ? 5 : 1;
      this.settings.strokeWidth = 1 * scale;
      this.canvas.width = 500;
      this.canvas.height = 500;
      paper.view.viewSize = new paper.Size(
        this.canvas.width * scale,
        this.canvas.height * scale,
      );
      requestAnimationFrame(() => {
        this.draw();
        paper.view.update();
        resolve();
      });
    });
  }

  draw() {
    paper.project.activeLayer.removeChildren();

    this.group = new paper.Group();
    this.group.opacity = this.settings.opacity;

    this.layers.blueprint = new paper.Group();
    this.layers.form = new paper.Group();

    this.layers.blueprint.visible = this.settings.blueprint.visible as boolean;
    this.layers.form.visible = this.settings.form.visible as boolean;

    this.layers.blueprint.opacity = this.settings.blueprint.opacity as number;
    this.layers.form.opacity = this.settings.form.opacity as number;

    this.group.addChild(this.layers.blueprint);
    this.group.addChild(this.layers.form);

    // create a rectangle to fill the background
    if (this.settings.darkness) {
      const background = new paper.Path.Rectangle(
        paper.view.bounds.topLeft,
        paper.view.bounds.bottomRight,
      );
      background.fillColor = new paper.Color(0, 0, 0);
    }
  }

  name() {
    return "sketch";
  }

  fileName() {
    return this.name().replace(/ /g, "-").toLowerCase();
  }

  async saveImage() {
    await this.setup(true);
    await saveImage(this.canvas, this.fileName());
    await this.setup(false);
  }

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
    this.gui.addBinding(target.settings, "darkness").on("change", this.draw);

    this.folders.blueprint = this.addFolder(this.gui, { title: "Blueprint" });
    this.folders.blueprint
      .addBinding(target.settings.blueprint, "visible")
      .on("change", this.draw);
    this.folders.blueprint
      .addBinding(target.settings.blueprint, "opacity", { min: 0, max: 1 })
      .on("change", this.draw);
    this.folders.blueprint
      .addBinding(target.settings.blueprint, "cosmos")
      .on("change", this.draw);

    this.folders.form = this.addFolder(this.gui, { title: "Form" });
    this.folders.form
      .addBinding(target.settings.form, "opacity", { min: 0, max: 1 })
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "visible")
      .on("change", this.draw);

    this.gui.addButton({ title: "Save Image", label: "" }).on("click", () => {
      target.saveImage();
    });
    this.gui
      .addButton({ title: "Save SVG", label: "" })
      .on("click", target.saveSVG);
  }

  draw = () => {
    this.target.draw();
  };
}
