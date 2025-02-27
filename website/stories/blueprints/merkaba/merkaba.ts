import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  sketchSettings,
  SketchSettings,
} from "../sketch/sketch";
import { merkaba, MerkabaSettings } from "./merkaba-geometry";

export default class Merkaba extends Sketch {
  settings: SketchSettings & MerkabaSettings = {
    ...sketchSettings,
    blueprint: {
      visible: false,
      opacity: 0.5,
      cosmos: true,
      architecture: true,
    },
    form: {
      visible: true,
      opacity: 1,
      masculinity: true,
      femininity: true,
      union: true,
    },
  };

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    merkaba(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }

  name() {
    return "Merkaba";
  }
}

export class GUIMerkaba extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: Merkaba,
  ) {
    super(gui, target, target.name());

    this.folders.blueprint
      .addBinding(target.settings.blueprint, "architecture")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "masculinity")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "femininity")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "union")
      .on("change", this.draw);
  }
}
