import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  sketchSettings,
  SketchSettings,
} from "../sketch/sketch";
import { fruitOfLife, FruitOfLifeSettings } from "./fruit-of-life-geometry";

export default class FruitOfLife extends Sketch {
  settings: SketchSettings & FruitOfLifeSettings = {
    ...sketchSettings,
    blueprint: {
      visible: false,
      opacity: 0.5,
      cosmos: true,
    },
    form: {
      visible: true,
      opacity: 1,
      creation: true,
      architecture: true,
    },
  };

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Fruit Of Life");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    fruitOfLife(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }
}

export class GUIFruitOfLife extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: FruitOfLife,
  ) {
    super(gui, target, target.name());

    this.folders.form
      .addBinding(target.settings.form, "creation")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "architecture")
      .on("change", this.draw);
  }
}
