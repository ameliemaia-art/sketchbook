import paper from "paper";
import { FolderApi } from "tweakpane";

import { saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import { vectorEquilibriumSpherical } from "./vector-equilibrium-spherical-geometry";

const strokeScale = 1;

export default class VectorEquilibriumSpherical {
  settings = {
    scale: 0.85,
    opacity: 1,
    strokeWidth: 1 * strokeScale,
    color: new paper.Color(1, 1, 1, 1),
    layers: {
      background: false,
      outline: false,
      circles: false,
      structure: true,
      layer0: true,
      layer1: true,
      layer2: true,
    },
    petalRadius: 2,
    petalOffset: 2,
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
      vectorEquilibriumSpherical(
        center,
        radius,
        this.settings.color,
        this.settings.strokeWidth,
        this.settings.layers.outline,
        this.settings.layers.circles,
        this.settings.layers.structure,
        this.settings.layers.layer0,
        this.settings.layers.layer1,
        this.settings.layers.layer2,
      ),
    );
  };

  saveImage = () => {
    saveImage(this.canvas, "vector-equilibrium-spherical");
  };

  saveSVG = () => {
    saveSVG(paper.project, "vector-equilibrium-spherical");
  };
}

export class GUIVectorEquilibriumSpherical extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: VectorEquilibriumSpherical,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Vector Equilibrium Spherical" });

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
      .addBinding(target.settings.layers, "structure")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "layer0")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "layer1")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "layer2")
      .on("change", target.draw);

    this.gui.addButton({ title: "Save Image" }).on("click", target.saveImage);
    this.gui.addButton({ title: "Save SVG" }).on("click", target.saveSVG);
  }
}
