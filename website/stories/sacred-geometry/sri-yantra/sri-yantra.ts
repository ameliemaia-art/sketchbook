import paper from "paper";
import { FolderApi } from "tweakpane";

import { saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import { sriYantra } from "./sri-yantra-geometry";

const strokeScale = 1;

export default class SriYantra {
  settings = {
    scale: 1,
    opacity: 1,
    strokeWidth: 1 * strokeScale,
    debugColor: new paper.Color(1, 1, 1, 0.25),
    color: new paper.Color(1, 1, 1, 1),
    layers: {
      background: false,
      outline: false,
    },
  };

  constructor(
    public canvas: HTMLCanvasElement,
    setup = true,
  ) {
    this.canvas = canvas;

    if (setup) {
      canvas.width = 1250;
      canvas.height = 1250;
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
      sriYantra(
        center,
        radius,
        this.settings.color,
        this.settings.debugColor,
        this.settings.strokeWidth,
        this.settings.layers.outline,
      ),
    );
  };

  saveImage = () => {
    saveImage(this.canvas, "sri-yantra");
  };

  saveSVG = () => {
    saveSVG(paper.project, "sri-yantra");
  };
}

export class GUISriYantra extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: SriYantra,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Sri Yantra" });

    this.gui
      .addBinding(target.settings, "strokeWidth", { min: 0.1 })
      .on("change", target.draw);
    this.gui
      .addBinding(target.settings, "scale", { min: 0.1, max: 1 })
      .on("change", target.draw);
    this.gui
      .addBinding(target.settings, "opacity", { min: 0, max: 1 })
      .on("change", target.draw);

    this.folders.layers = this.addFolder(this.gui, { title: "Layers" });
    this.folders.layers
      .addBinding(target.settings.layers, "background")
      .on("change", target.draw);

    this.folders.layers
      .addBinding(target.settings.layers, "outline")
      .on("change", target.draw);

    this.gui.addButton({ title: "Save Image" }).on("click", target.saveImage);
    this.gui.addButton({ title: "Save SVG" }).on("click", target.saveSVG);
  }
}
