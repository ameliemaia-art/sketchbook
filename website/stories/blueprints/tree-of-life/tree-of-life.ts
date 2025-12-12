import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  sketchSettings,
  SketchSettings,
} from "../sketch/sketch";
import { treeOfLife, TreeOfLifeSettings } from "./tree-of-life-geometry";

export default class TreeOfLife extends Sketch {
  settings: SketchSettings & TreeOfLifeSettings = {
    ...sketchSettings,
    blueprint: {
      visible: false,
      opacity: 0.5,
      cosmos: true,
      guide0: true,
      guide1: true,
      guide2: true,
      guide3: true,
    },
    form: {
      visible: true,
      opacity: 1,
      architecture0: true,
      architecture1: true,
      architecture2: true,
      architecture3: true,
      architecture4: true,
      architecture5: true,
      architecture6: true,
      architecture7: true,
      architecture8: true,
      architecture9: true,
    },
  };

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Tree Of Life");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    treeOfLife(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }
}

export class GUITreeOfLife extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: TreeOfLife,
  ) {
    super(gui, target, target.name());

    for (let i = 0; i < 4; i++) {
      this.folders.blueprint
        .addBinding(target.settings.blueprint, `guide${i}`)
        .on("change", this.draw);
    }
    for (let i = 0; i < 10; i++) {
      this.folders.form
        .addBinding(target.settings.form, `architecture${i}`)
        .on("change", this.draw);
    }
  }
}
