import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, { GUISketch } from "../sketch/sketch";
import { eggOfLife } from "./egg-of-life-geometry";

export default class EggOfLife extends Sketch {
  draw() {
    super.draw();

    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;

    this.group?.addChild(eggOfLife(center, radius, this.settings));
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
  }
}
