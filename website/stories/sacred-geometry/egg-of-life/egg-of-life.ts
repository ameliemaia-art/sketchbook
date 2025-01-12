import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import { eggOfLife, EggOfLifeSettings } from "./egg-of-life-geometry";

export default class EggOfLife extends Sketch {
  settings: SketchSettings & EggOfLifeSettings = {
    ...sketchSettings,
    blueprint: {
      visible: true,
      opacity: 0.5,
      cosmos: true,
    },
    form: {
      visible: true,
      opacity: 1,
      seed: true,
      petals: true,
    },
  };

  draw() {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    eggOfLife(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }

  name() {
    return "Egg of Life";
  }
}

export class GUIEggOfLife extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: EggOfLife,
  ) {
    super(gui, target, target.name());

    this.folders.form
      .addBinding(target.settings.form, "seed")
      .on("change", this.draw);
    this.folders.form
      .addBinding(target.settings.form, "petals")
      .on("change", this.draw);
  }
}
