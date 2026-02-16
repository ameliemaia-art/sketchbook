import paper from "paper";
import { FolderApi } from "tweakpane";

import { gridSettings } from "@utils/paper/utils";
import Sketch, {
  BlueprintSettings,
  blueprintSettings,
  GUIBlueprint,
} from "../blueprint/blueprint";
import { ascension, AscensionSettings } from "./ascension-geometry";

export default class Ascension extends Sketch {
  settings: BlueprintSettings & AscensionSettings = {
    ...blueprintSettings,
    grid: {
      ...gridSettings,
      visible: false,
    },
    darkness: true,
    blueprint: {
      visible: true,
      opacity: 0.5,
      cosmos: false,
    },
    form: {
      visible: true,
      opacity: 1,
      crossHeight: 0.1,
      crossLength: 0.3,
      time: 45,
      life: 1,
      years: 40,
    },
  };

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Ascension");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    ascension(
      this.layers.blueprint,
      this.layers.form,
      center,
      paper.view.size,
      radius,
      this.settings,
    );
  }
}

export class GUIAscension extends GUIBlueprint {
  constructor(
    gui: FolderApi,
    public target: Ascension,
  ) {
    super(gui, target, target.name());

    // Form controls
    const formFolder = this.folders.form;
    if (formFolder) {
      formFolder
        .addBinding(target.settings.form, "crossHeight", {
          label: "Cross Height",
          min: 0.1,
          max: 1.0,
          step: 0.01,
        })
        .on("change", this.draw);
      formFolder
        .addBinding(target.settings.form, "crossLength", {
          label: "Cross Length",
          min: 0.1,
          max: 1.0,
          step: 0.01,
        })
        .on("change", this.draw);
      formFolder
        .addBinding(target.settings.form, "time", {
          min: 0,
          max: 360,
          step: 0.01,
        })
        .on("change", this.draw);
      formFolder
        .addBinding(target.settings.form, "life", {
          min: 0,
          max: 1,
          step: 0.01,
        })
        .on("change", this.draw);
    }
  }
}
