import paper from "paper";
import { FolderApi } from "tweakpane";

import { saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import { germOfLife } from "./germ-of-life-geometry";

const strokeScale = 1;

export default class GermOfLife {
  settings = {
    scale: 0.85,
    opacity: 1,
    strokeWidth: 1 * strokeScale,
    color: new paper.Color(1, 1, 1, 1),
    layers: {
      darkness: false,
      universe: true,
      creation: true,
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
    if (this.settings.layers.darkness) {
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
      germOfLife(
        center,
        radius,
        this.settings.color,
        this.settings.strokeWidth,
        this.settings.layers.universe,
        this.settings.layers.creation,
      ),
    );
  };

  saveImage = () => {
    saveImage(this.canvas, "germ-of-life");
  };

  saveSVG = () => {
    saveSVG(paper.project, "germ-of-life");
  };
}

export class GUIGermOfLife extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: GermOfLife,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Germ of Life" });

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
      .addBinding(target.settings.layers, "darkness")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "universe")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "creation")
      .on("change", target.draw);

    this.gui.addButton({ title: "Save Image" }).on("click", target.saveImage);
    this.gui.addButton({ title: "Save SVG" }).on("click", target.saveSVG);
  }
}
