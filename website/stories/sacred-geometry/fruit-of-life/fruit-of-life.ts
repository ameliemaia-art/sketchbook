import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, { GUISketch } from "../sketch/sketch";
import { fruitOfLife } from "./fruit-of-life-geometry";

export default class FruitOfLife extends Sketch {
  draw() {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    this.group?.addChild(fruitOfLife(center, radius, this.settings));
  }

  name() {
    return "Fruit of Life";
  }
}

export class GUIFruitOfLife extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: FruitOfLife,
  ) {
    super(gui, target, target.name());
  }
}
