import paper from "paper";
import { FolderApi } from "tweakpane";

import { saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import { treeOfLife } from "./tree-of-life-geometry";

const strokeScale = 1;

export default class TreeOfLife {
  settings = {
    scale: 0.85,
    opacity: 1,
    strokeWidth: 1 * strokeScale,
    debugStrokeColor: new paper.Color(1, 1, 1, 0.25),
    color: new paper.Color(1, 1, 1, 1),
    layers: {
      darkness: false,
      light: false,
      guide0: false,
      guide1: false,
      guide2: false,
      guide3: false,
      form0: true,
      form1: true,
      form2: true,
      form3: true,
      form4: true,
      form5: true,
      form6: true,
      form7: true,
      form8: true,
      form9: true,
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
      treeOfLife(
        center,
        radius,
        this.settings.color,
        this.settings.debugStrokeColor,
        this.settings.strokeWidth,
        this.settings.layers.light,
        this.settings.layers.guide0,
        this.settings.layers.guide1,
        this.settings.layers.guide2,
        this.settings.layers.guide3,
        this.settings.layers.form0,
        this.settings.layers.form1,
        this.settings.layers.form2,
        this.settings.layers.form3,
        this.settings.layers.form4,
        this.settings.layers.form5,
        this.settings.layers.form6,
        this.settings.layers.form7,
        this.settings.layers.form8,
        this.settings.layers.form9,
      ),
    );
  };

  saveImage = () => {
    saveImage(this.canvas, "tree-of-life");
  };

  saveSVG = () => {
    saveSVG(paper.project, "tree-of-life");
  };
}

export class GUITreeOfLife extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: TreeOfLife,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Tree of Life" });

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
      .addBinding(target.settings.debugStrokeColor, "alpha", {
        min: 0,
        max: 1,
        label: "guide",
      })
      .on("change", target.draw);

    this.folders.layers = this.addFolder(this.gui, { title: "Form" });
    this.folders.layers
      .addBinding(target.settings.layers, "darkness")
      .on("change", target.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "light")
      .on("change", target.draw);

    this.folders.guide = this.addFolder(this.folders.layers, {
      title: "Guides",
    });
    this.folders.form = this.addFolder(this.folders.layers, {
      title: "Form",
    });

    for (let i = 0; i < 4; i++) {
      this.folders.guide
        .addBinding(target.settings.layers, `guide${i}`)
        .on("change", target.draw);
    }
    for (let i = 0; i < 10; i++) {
      this.folders.form
        .addBinding(target.settings.layers, `form${i}`)
        .on("change", target.draw);
    }

    this.gui.addButton({ title: "Save Image" }).on("click", target.saveImage);
    this.gui.addButton({ title: "Save SVG" }).on("click", target.saveSVG);
  }
}
