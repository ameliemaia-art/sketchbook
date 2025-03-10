import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import { vesciaPiscis, VesicaPiscisSettings } from "./vescia-piscis-geometry";

export default class VesicaPiscis extends Sketch {
  settings: SketchSettings & VesicaPiscisSettings = {
    ...sketchSettings,
    blueprint: {
      visible: false,
      opacity: 0.5,
      cosmos: true,
    },
    form: {
      visible: true,
      opacity: 1,
      divinity: true,
      awakening: true,
      conscious: true,
      unconscious: true,
    },
  };

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Vesica Piscis");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    vesciaPiscis(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }
}

export class GUIVesicaPiscis extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: VesicaPiscis,
  ) {
    super(gui, target, target.name());

    this.folders.form
      .addBinding(target.settings.form, "divinity")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "awakening")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "conscious")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "unconscious")
      .on("change", this.draw);
  }
}
