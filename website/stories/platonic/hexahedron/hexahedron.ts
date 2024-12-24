import paper from "paper";
import { Vector3 } from "three";
import { FolderApi } from "tweakpane";

import { saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import { hexahedron } from "./hexahedron-geometry";

const strokeScale = 1;

export default class Hexahedron {
  settings = {
    scale: 0.85,
    opacity: 1,
    strokeWidth: 1 * strokeScale,
    strokeColor: new paper.Color(1, 1, 1, 1),
    guideColor: new paper.Color(1, 1, 1, 0.25),
    lightDirection: new Vector3(0.65, 1, 0.15),
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
      hexahedron(
        center,
        radius,
        this.settings.strokeColor,
        this.settings.strokeWidth,
        this.settings.guideColor,
        this.settings.lightDirection,
        this.settings.layers.outline,
      ),
    );
  };

  saveImage = () => {
    saveImage(this.canvas, "hexahedron");
  };

  saveSVG = () => {
    saveSVG(paper.project, "hexahedron");
  };
}

export class GUIHexahedron extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: Hexahedron,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Hexahedron" });

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
      .addBinding(target.settings.guideColor, "alpha", {
        min: 0,
        max: 1,
        label: "guideColor",
      })
      .on("change", target.draw);
    this.gui
      .addBinding(target.settings, "lightDirection", {
        x: {
          min: -1,
          max: 1,
        },
        y: {
          min: -1,
          max: 1,
        },
        z: {
          min: -1,
          max: 1,
        },
        label: "lightDirection",
      })
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
