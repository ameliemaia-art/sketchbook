import paper from "paper";
import { Vector3 } from "three";
import { FolderApi } from "tweakpane";

import { saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import { platonic, SketchSettings } from "./platonic-geometry";

const strokeScale = 1;

export default class Platonic {
  settings: SketchSettings = {
    scale: 0.85,
    opacity: 1,
    strokeWidth: 1 * strokeScale,
    strokeColor: new paper.Color(1, 1, 1, 1),
    strokeDepthColor: new paper.Color(1, 1, 1, 0.5),
    grid: {
      divisions: 25,
      strokeWidth: 1 * strokeScale,
      strokeColor: new paper.Color(1, 1, 1, 0.1),
    },
    guide: {
      strokeColor: new paper.Color(1, 1, 1, 0.25),
      strokeWidth: 1 * strokeScale,
    },
    layers: {
      background: true,
      outline: false,
      tetrahedron: false,
      hexahedron: false,
      octahedron: false,
      icosahedron: false,
      dodecahedron: true,
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

    group.addChild(platonic(center, paper.view.size, radius, this.settings));
  };

  get name() {
    if (this.settings.layers.tetrahedron) return "tetrahedron";
    if (this.settings.layers.hexahedron) return "hexahedron";
    if (this.settings.layers.octahedron) return "octahedron";
    if (this.settings.layers.icosahedron) return "icosahedron";
    if (this.settings.layers.dodecahedron) return "dodecahedron";
    return "platonic";
  }

  saveImage = () => {
    saveImage(this.canvas, this.name);
  };

  saveSVG = () => {
    saveSVG(paper.project, this.name);
  };
}

export class GUIPlatonic extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: Platonic,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Platonic" });

    this.gui
      .addBinding(target.settings, "scale", { min: 0.1, max: 1 })
      .on("change", target.draw);
    this.gui
      .addBinding(target.settings, "opacity", { min: 0, max: 1 })
      .on("change", target.draw);

    this.gui
      .addBinding(target.settings, "strokeWidth", { min: 0.1 })
      .on("change", target.draw);

    this.gui
      .addBinding(target.settings.strokeColor, "alpha", {
        label: "strokeColor",
        min: 0,
        max: 1,
      })
      .on("change", target.draw);
    this.gui
      .addBinding(target.settings.strokeDepthColor, "alpha", {
        label: "strokeDepthColor",
        min: 0,
        max: 1,
      })
      .on("change", target.draw);

    this.folders.grid = this.addFolder(this.gui, { title: "Grid" });
    this.folders.grid
      .addBinding(target.settings.grid, "strokeWidth", {
        min: 0,
        max: 1,
      })
      .on("change", target.draw);
    this.folders.grid
      .addBinding(target.settings.grid.strokeColor, "alpha", {
        min: 0,
        max: 1,
        label: "strokeColor",
      })
      .on("change", target.draw);

    this.folders.guide = this.addFolder(this.gui, { title: "Guide" });
    this.folders.guide
      .addBinding(target.settings.guide, "strokeWidth", {
        min: 0,
        max: 1,
      })
      .on("change", target.draw);
    this.folders.guide
      .addBinding(target.settings.guide.strokeColor, "alpha", {
        min: 0,
        max: 1,
        label: "strokeColor",
      })
      .on("change", target.draw);

    this.folders.layers = this.addFolder(this.gui, { title: "Layers" });
    this.folders.layers
      .addBinding(target.settings.layers, "background")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "outline")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "hexahedron")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "icosahedron")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "tetrahedron")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "octahedron")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "dodecahedron")
      .on("change", target.draw);

    this.gui.addButton({ title: "Save Image" }).on("click", target.saveImage);
    this.gui.addButton({ title: "Save SVG" }).on("click", target.saveSVG);
  }
}
