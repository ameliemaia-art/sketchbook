import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import { sriYantra, SriYantraSettings } from "./sri-yantra-geometry";

export default class SriYantra extends Sketch {
  settings: SketchSettings & SriYantraSettings = {
    ...sketchSettings,
    blueprint: {
      visible: false,
      opacity: 0.5,
      cosmos: true,
      guide0: true,
      guide1: true,
      guide2: true,
      guide3: true,
      guide4: true,
      guide5: true,
      guide6: true,
      guide7: true,
      guide8: true,
      guide9: true,
      guide10: true,
      guide11: true,
      guide12: true,
      guide13: true,
      guide14: true,
      guide15: true,
      guide16: true,
      guide17: true,
      guide18: true,
      guide19: true,
      guide20: true,
      guide21: true,
      guide22: true,
      guide23: true,
      guide24: true,
      guide25: true,
      guide26: true,
      guide27: true,
      guide28: true,
    },
    form: {
      visible: true,
      opacity: 1,
      step0: true,
      step1: true,
      step2: true,
      step3: true,
      step4: true,
      step5: true,
      step6: true,
      step7: true,
      step8: true,
      step9: true,
    },
  };

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Sri Yantra");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    sriYantra(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }
}

export class GUISriYantra extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: SriYantra,
  ) {
    super(gui, target, target.name());

    for (let i = 0; i < 29; i++) {
      this.folders.blueprint
        .addBinding(target.settings.blueprint, `guide${i}`)
        .on("change", this.draw);
    }
    for (let i = 0; i < 10; i++) {
      this.folders.form
        .addBinding(target.settings.form, `step${i}`)
        .on("change", this.draw);
    }
  }
}
