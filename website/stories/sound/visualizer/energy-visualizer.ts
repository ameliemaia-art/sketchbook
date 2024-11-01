import paper from "paper";
import { MathUtils } from "three";
import { FolderApi } from "tweakpane";

import { MotionEase2D } from "@utils/common/motion-ease";
import GUIController from "@utils/gui/gui";

export default class EnergyVisualizer {
  settings = {
    onColor: 1,
    offColor: 0.05,
    width: 0.5,
  };

  group!: paper.Group;
  motionEase = new MotionEase2D();
  detected = false;

  constructor(
    public x: number,
    public y: number,
    public size: number,
  ) {
    this.motionEase.easing = 0.75;
  }

  draw(detected: boolean) {
    this.group = new paper.Group();

    if (detected !== this.detected) {
      this.detected = detected;
      this.motionEase.setValue(detected ? 1 : 0, 0, true);
    }

    this.motionEase.update();

    const fill = new paper.Path.Rectangle({
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size * this.motionEase.value.x,
    });
    fill.scale(
      -1,
      new paper.Point(this.x + this.size / 2, this.y + this.size / 2),
    );

    fill.fillColor = new paper.Color(1, 1, 1, 1);

    this.group.addChild(fill);

    const border = new paper.Path.Rectangle({
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size,
    });

    border.strokeColor = new paper.Color("rgba(255, 255, 255, 1)");
    border.strokeWidth = this.settings.width;

    this.group.addChild(border);
  }
}

export class VisualizerGUI extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: EnergyVisualizer,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "EnergyVisualizer" });
  }
}
