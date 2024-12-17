import paper from "paper";
import { FolderApi } from "tweakpane";

import { saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import { goldenRectangle } from "./golden-rectangle-geometry";

const strokeScale = 4;

export default class GoldenRectangle {
  settings = {
    scale: 0.85,
    opacity: 1,
    strokeWidth: 1 * strokeScale,
    color: new paper.Color(1, 1, 1, 1),
    divisions: 9,
    layers: {
      background: false,
      outline: false,
      rectangle: false,
      subdivisions: false,
      spiral: true,
    },
  };

  constructor(
    public canvas: HTMLCanvasElement,
    setup = true,
  ) {
    this.canvas = canvas;

    if (setup) {
      canvas.width = 2000;
      canvas.height = 2000;
      paper.setup(canvas);
    }

    this.draw();
  }

  draw = () => {
    paper.project.activeLayer.removeChildren();

    let group = new paper.Group();
    group.opacity = this.settings.opacity;

    // create a rectangle to fill the background
    if (this.settings.layers.background) {
      const background = new paper.Path.Rectangle(
        paper.view.bounds.topLeft,
        paper.view.bounds.bottomRight,
      );
      background.fillColor = new paper.Color(0, 0, 0);
      group.addChild(background);
    }

    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;

    group.addChild(
      goldenRectangle(
        center,
        radius,
        this.settings.color,
        this.settings.strokeWidth,
        this.settings.divisions,
        this.settings.layers.outline,
        this.settings.layers.rectangle,
        this.settings.layers.subdivisions,
        this.settings.layers.spiral,
      ),
    );
  };

  saveImage = () => {
    saveImage(this.canvas, "golden-rectangle");
  };

  saveSVG = () => {
    saveSVG(paper.project, "golden-rectangle");
  };
}

export class GUIGoldenRectangle extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: GoldenRectangle,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Golden Rectangle" });

    this.gui
      .addBinding(target.settings, "strokeWidth", { min: 0.1 })
      .on("change", target.draw);
    this.gui
      .addBinding(target.settings, "scale", { min: 0.1, max: 1 })
      .on("change", target.draw);
    this.gui
      .addBinding(target.settings, "opacity", { min: 0, max: 1 })
      .on("change", target.draw);
    this.gui
      .addBinding(target.settings, "divisions", { min: 0, max: 10, step: 1 })
      .on("change", target.draw);

    this.folders.layers = this.addFolder(this.gui, { title: "Layers" });
    this.folders.layers
      .addBinding(target.settings.layers, "background")
      .on("change", target.draw);

    this.folders.layers
      .addBinding(target.settings.layers, "outline")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "rectangle")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "subdivisions")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "spiral")
      .on("change", target.draw);

    this.gui.addButton({ title: "Save Image" }).on("click", target.saveImage);
    this.gui.addButton({ title: "Save SVG" }).on("click", target.saveSVG);
  }
}
