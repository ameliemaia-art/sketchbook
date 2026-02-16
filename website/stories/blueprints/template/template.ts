import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import { template, TemplateSettings } from "./template-geometry";

export default class Template extends Sketch {
  settings: SketchSettings & TemplateSettings = {
    ...sketchSettings,
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
      radius,
      this.settings,
    );
  }
}

export class GUITemplate extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: Template,
  ) {
    super(gui, target, target.name());
  }
}
