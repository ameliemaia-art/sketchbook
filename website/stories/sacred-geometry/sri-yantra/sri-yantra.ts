import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import { sriYantra } from "./sri-yantra-geometry";

export default class SriYantra extends Sketch {
  settings: SketchSettings = {
    ...sketchSettings,
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

  draw() {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    this.group?.addChild(sriYantra(center, radius, this.settings));
  }

  name() {
    return "Sri Yantra";
  }
}

export class GUISriYantra extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: SriYantra,
  ) {
    super(gui, target, target.name());

    this.folders.guide = this.addFolder(this.folders.layers, {
      title: "Guides",
    });
    this.folders.steps = this.addFolder(this.folders.layers, {
      title: "Steps",
    });

    for (let i = 0; i < 29; i++) {
      this.folders.guide
        .addBinding(target.settings.layers, `guide${i}`)
        .on("change", this.draw);
    }
    for (let i = 0; i < 10; i++) {
      this.folders.steps
        .addBinding(target.settings.layers, `step${i}`)
        .on("change", this.draw);
    }
  }
}
