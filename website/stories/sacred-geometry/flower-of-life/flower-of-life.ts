import paper from "paper";
import { FolderApi } from "tweakpane";

import { saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import { flowerOfLife } from "../sacred-geometry";

const strokeScale = 1;

export default class FlowerOfLife {
  settings = {
    scale: 0.85,
    opacity: 1,
    dimensions: 3,
    width: 1 * strokeScale,
    color: new paper.Color(1, 1, 1, 1),
    layers: {
      background: false,
      circles: true,
      outline: false,
      lines: false,
      corners: false,
    },
  };

  constructor(
    public canvas: HTMLCanvasElement,
    setup = true,
  ) {
    this.canvas = canvas;

    if (setup) {
      canvas.width = 500;
      canvas.height = 500;
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
      flowerOfLife(
        center,
        radius,
        this.settings.dimensions,
        this.settings.color,
        this.settings.width,
        this.settings.layers.circles,
        this.settings.layers.outline,
        this.settings.layers.lines,
        this.settings.layers.corners,
      ),
    );
  };

  saveImage = () => {
    saveImage(this.canvas, "flower-of-life");
  };

  saveSVG = () => {
    saveSVG(paper.project, "flower-of-life");
  };
}

export class GUIFlowerOfLife extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: FlowerOfLife,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Flower Of Life" });

    this.gui
      .addBinding(target.settings, "scale", { min: 0.1, max: 1 })
      .on("change", target.draw);
    this.gui
      .addBinding(target.settings, "opacity", { min: 0, max: 1 })
      .on("change", target.draw);
    this.gui
      .addBinding(target.settings, "dimensions", { min: 1, max: 10, step: 1 })
      .on("change", target.draw);

    this.folders.layers = this.addFolder(this.gui, { title: "Layers" });
    this.folders.layers
      .addBinding(target.settings.layers, "background")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "circles")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "outline")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "lines")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "corners")
      .on("change", target.draw);

    this.gui.addButton({ title: "Save Image" }).on("click", target.saveImage);
    this.gui.addButton({ title: "Save SVG" }).on("click", target.saveSVG);
  }
}
