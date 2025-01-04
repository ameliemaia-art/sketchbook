import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, { GUISketch } from "../sketch/sketch";
import { germOfLife } from "./germ-of-life-geometry";

export default class GermOfLife extends Sketch {
  draw() {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    this.group?.addChild(germOfLife(center, radius, this.settings));
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
  }
}
