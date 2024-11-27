import paper from "paper";
import { FolderApi } from "tweakpane";

import { saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import { merkaba } from "./merkaba-geometry";

const strokeScale = 1;

export default class Merkaba {
  settings = {
    scale: 0.85,
    opacity: 1,
    strokeWidth: 1 * strokeScale,
    color: new paper.Color(1, 1, 1, 1),
    layers: {
      background: false,
      outline: false,
      circles: false,
      masculinity: true,
      femininity: true,
      unity: true,
      interconnectedness: true,
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
      merkaba(
        center,
        radius,
        this.settings.color,
        this.settings.strokeWidth,
        this.settings.layers.outline,
        this.settings.layers.circles,
        this.settings.layers.masculinity,
        this.settings.layers.femininity,
        this.settings.layers.unity,
        this.settings.layers.interconnectedness,
      ),
    );
  };

  saveImage = () => {
    saveImage(this.canvas, "merkaba");
  };

  saveSVG = () => {
    saveSVG(paper.project, "merkaba");
  };
}

export class GUIMerkaba extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: Merkaba,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Merkaba" });

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

    this.folders.layers
      .addBinding(target.settings.layers, "circles")
      .on("change", target.draw);

    this.folders.layers
      .addBinding(target.settings.layers, "masculinity")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "femininity")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "unity")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "interconnectedness")
      .on("change", target.draw);

    this.gui.addButton({ title: "Save Image" }).on("click", target.saveImage);
    this.gui.addButton({ title: "Save SVG" }).on("click", target.saveSVG);
  }
}
