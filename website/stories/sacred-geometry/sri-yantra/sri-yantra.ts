import paper from "paper";
import { FolderApi } from "tweakpane";

import { saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import { sriYantra } from "./sri-yantra-geometry";

const strokeScale = 4;

export default class SriYantra {
  settings = {
    scale: 0.85,
    opacity: 1,
    strokeWidth: 1 * strokeScale,
    color: new paper.Color(1, 1, 1, 1),
    debugStrokeColor: new paper.Color(1, 1, 1, 0.25),
    layers: {
      background: false,
      outline: false,
      guide0: false,
      guide1: false,
      guide2: false,
      guide3: false,
      guide4: false,
      guide5: false,
      guide6: false,
      guide7: false,
      guide8: false,
      guide9: false,
      guide10: false,
      guide11: false,
      guide12: false,
      guide13: false,
      guide14: false,
      guide15: false,
      guide16: false,
      guide17: false,
      guide18: false,
      guide19: false,
      guide20: false,
      guide21: false,
      guide22: false,
      guide23: false,
      guide24: false,
      guide25: false,
      guide26: false,
      guide27: false,
      guide28: false,
      step0: false,
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: false,
      step6: false,
      step7: false,
      step8: false,
      step9: false,
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
      sriYantra(
        center,
        radius,
        this.settings.color,
        this.settings.debugStrokeColor,
        this.settings.strokeWidth,
        this.settings.layers.outline,
        this.settings.layers.guide0,
        this.settings.layers.guide1,
        this.settings.layers.guide2,
        this.settings.layers.guide3,
        this.settings.layers.guide4,
        this.settings.layers.guide5,
        this.settings.layers.guide6,
        this.settings.layers.guide7,
        this.settings.layers.guide8,
        this.settings.layers.guide9,
        this.settings.layers.guide10,
        this.settings.layers.guide11,
        this.settings.layers.guide12,
        this.settings.layers.guide13,
        this.settings.layers.guide14,
        this.settings.layers.guide15,
        this.settings.layers.guide16,
        this.settings.layers.guide17,
        this.settings.layers.guide18,
        this.settings.layers.guide19,
        this.settings.layers.guide20,
        this.settings.layers.guide21,
        this.settings.layers.guide22,
        this.settings.layers.guide23,
        this.settings.layers.guide24,
        this.settings.layers.guide25,
        this.settings.layers.guide26,
        this.settings.layers.guide27,
        this.settings.layers.guide28,
        this.settings.layers.step0,
        this.settings.layers.step1,
        this.settings.layers.step2,
        this.settings.layers.step3,
        this.settings.layers.step4,
        this.settings.layers.step5,
        this.settings.layers.step6,
        this.settings.layers.step7,
        this.settings.layers.step8,
        this.settings.layers.step9,
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
    this.gui
      .addBinding(target.settings.debugStrokeColor, "alpha", {
        min: 0,
        max: 1,
        label: "guide",
      })
      .on("change", target.draw);

    this.folders.layers = this.addFolder(this.gui, { title: "Layers" });
    this.folders.layers
      .addBinding(target.settings.layers, "background")
      .on("change", target.draw);

    this.folders.layers
      .addBinding(target.settings.layers, "outline")
      .on("change", target.draw);

    for (let i = 0; i < 29; i++) {
      this.folders.layers
        .addBinding(target.settings.layers, `guide${i}`)
        .on("change", target.draw);
    }
    for (let i = 0; i < 10; i++) {
      this.folders.layers
        .addBinding(target.settings.layers, `step${i}`)
        .on("change", target.draw);
    }

    this.gui.addButton({ title: "Save Image" }).on("click", target.saveImage);
    this.gui.addButton({ title: "Save SVG" }).on("click", target.saveSVG);
  }
}
