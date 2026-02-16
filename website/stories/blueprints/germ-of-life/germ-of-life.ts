import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  BlueprintSettings,
  blueprintSettings,
  GUIBlueprint,
} from "../blueprint/blueprint";
import { germOfLife, GermOfLifeSettings } from "./germ-of-life-geometry";

export default class GermOfLife extends Sketch {
  settings: BlueprintSettings & GermOfLifeSettings = {
    ...blueprintSettings,
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

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Germ Of Life");
  }

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
}

export class GUIGermOfLife extends GUIBlueprint {
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
