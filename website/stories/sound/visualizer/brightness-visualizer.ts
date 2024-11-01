import paper from "paper";
import { FolderApi } from "tweakpane";

import GUIController from "@utils/gui/gui";

export default class BrightnessVisualizer {
  settings = {
    onColor: 1,
    offColor: 0.05,
    width: 0.5,
  };

  group!: paper.Group;

  constructor(
    public x: number,
    public y: number,
    public size: number,
  ) {}

  draw(detected: boolean) {
    this.group = new paper.Group();

    const border = new paper.Path.Rectangle({
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size,
    });

    border.strokeColor = new paper.Color("rgba(255, 255, 255, 1)");
    border.strokeWidth = this.settings.width;

    const brightness = detected
      ? this.settings.onColor
      : this.settings.offColor;
    const color = new paper.Color(
      brightness,
      brightness,
      brightness,
      brightness,
    );

    border.fillColor = color;
  }
}

export class VisualizerGUI extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: BrightnessVisualizer,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "BightnessVisualizer" });
  }
}
