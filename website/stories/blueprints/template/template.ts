import paper from "paper";
import { FolderApi } from "tweakpane";

import { gridSettings } from "@utils/paper/utils";
import Sketch, {
  BlueprintSettings,
  blueprintSettings,
  GUIBlueprint,
} from "../blueprint/blueprint";
import { template, TemplateSettings } from "./template-geometry";

export default class Template extends Sketch {
  settings: BlueprintSettings & TemplateSettings = {
    ...blueprintSettings,
    grid: gridSettings,
    blueprint: {
      visible: false,
      opacity: 0.5,
      cosmos: true,
    },
    form: {
      visible: true,
      opacity: 1,
    },
  };

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Template");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    template(
      this.layers.blueprint,
      this.layers.form,
      center,
      paper.view.size,
      radius,
      this.settings,
    );
  }
}

export class GUITemplate extends GUIBlueprint {
  constructor(
    gui: FolderApi,
    public target: Template,
  ) {
    super(gui, target, target.name());
  }
}
