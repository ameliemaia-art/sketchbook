import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import { germOfLife, GermOfLifeSettings } from "./germ-of-life-geometry";

export default class GermOfLife extends Sketch {
  settings: SketchSettings & GermOfLifeSettings = {
    ...sketchSettings,
    blueprint: {
      visible: false,
      opacity: 0.5,
      cosmos: true,
    },
    form: {
      visible: true,
      opacity: 1,
      seed: true,
      petal: true,
    },
  };

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    germOfLife(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }

  name() {
    return "Germ Of Life";
  }
}

export class GUIGermOfLife extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: GermOfLife,
  ) {
    super(gui, target, target.name());

    this.folders.form
      .addBinding(target.settings.form, "seed")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "petal")
      .on("change", this.draw);
  }
}
