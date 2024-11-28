import paper from "paper";
import { FolderApi } from "tweakpane";

import { saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import { tetrahedron64Star } from "./tetrahedron-64-star-geometry";

const strokeScale = 1;

export default class Tetrahedron64Star {
  settings = {
    scale: 0.85,
    opacity: 1,
    strokeWidth: 1 * strokeScale,
    color: new paper.Color(1, 1, 1, 1),
    layers: {
      background: false,
      outline: false,
      circles: false,
      triangles: true,
      masculinity: true,
      femininity: true,
      structure: true,
      layer0: true,
      layer1: true,
      layer2: true,
      layer3: true,
      layer4: true,
      layer5: true,
      layer6: true,
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
      tetrahedron64Star(
        center,
        radius,
        this.settings.color,
        this.settings.strokeWidth,
        this.settings.layers.outline,
        this.settings.layers.circles,
        this.settings.layers.masculinity,
        this.settings.layers.femininity,
        this.settings.layers.structure,
        this.settings.layers.layer0,
        this.settings.layers.layer1,
        this.settings.layers.layer2,
        this.settings.layers.layer3,
        this.settings.layers.layer4,
        this.settings.layers.layer5,
        this.settings.layers.layer6,
      ),
    );
  };

  saveImage = () => {
    saveImage(this.canvas, "64-tetrahedron-star");
  };

  saveSVG = () => {
    saveSVG(paper.project, "64-tetrahedron-star");
  };
}

export class GUITetrahedron64Star extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: Tetrahedron64Star,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "64 Tetrahedron Star" });

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
    this.folders.layers
      .addBinding(target.settings.layers, "layer3")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "layer4")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "layer5")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "layer6")
      .on("change", target.draw);

    this.gui.addButton({ title: "Save Image" }).on("click", target.saveImage);
    this.gui.addButton({ title: "Save SVG" }).on("click", target.saveSVG);
  }
}
