import paper from "paper";
import { FolderApi } from "tweakpane";

import { saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import { flowerOfLife } from "../sacred-geometry";

const strokeScale = 1;

export default class FlowerOfLife {
  settings = {
    scale: 1,
    opacity: 1,
    width: 2 * strokeScale,
    color: new paper.Color(1, 1, 1, 1),
    debug: {
      width: 1,
      color: new paper.Color(1, 1, 1, 0),
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

    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;

    group.addChild(
      flowerOfLife(center, radius, this.settings.color, this.settings.width),
    );
  };

  saveImage = () => {
    saveImage(this.canvas, "identity");
  };

  saveSVG = () => {
    saveSVG(paper.project, "identity");
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
  }
}
