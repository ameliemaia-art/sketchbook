import paper from "paper";
import { MathUtils } from "three";
import { FolderApi } from "tweakpane";

import GUIController from "@utils/gui/gui";

export default class Graph {
  settings = {
    color: new paper.Color(1, 1, 1, 1),
    width: 0.5,
    legendOffset: 10,
    legendFontSize: 10,
    frequencyStart: 2500,
    frequencyEnd: 4000,
  };

  group!: paper.Group;

  constructor(
    public x: number,
    public y: number,
    public size: number,
  ) {}

  draw() {
    this.group = new paper.Group();

    const border = new paper.Path.Rectangle({
      x: this.x - this.size / 2,
      y: this.y - this.size / 2,
      width: this.size,
      height: this.size,
    });

    border.strokeColor = new paper.Color("rgba(255, 255, 255, 1)");
    border.strokeWidth = this.settings.width;

    // Draw legends
    this.drawAmplitudeLabels();
    this.drawFrequencyLabels();
    this.drawFrequency();
  }

  drawAmplitudeLabels() {
    const labelCount = 3;

    for (let i = 0; i < labelCount; i++) {
      const y = MathUtils.lerp(
        this.y + this.size / 2,
        this.y - this.size / 2 + this.settings.legendFontSize,
        i / (labelCount - 1),
      );
      const amplitudeValue = i / (labelCount - 1); // Scale from 1 at top to 0 at bottom

      const label = new paper.PointText({
        point: [this.x - this.size / 2 - this.settings.legendOffset, y], // 10px left of the graph border
        content: amplitudeValue,
        fillColor: this.settings.color,
        fontSize: this.settings.legendFontSize,
        justification: "right",
      });

      this.group.addChild(label);
    }
  }

  drawFrequencyLabels() {
    // Draw labels along the bottom side (frequency from left to right)
    const labelCount = 5;
    const offset = 10;

    for (let i = 0; i < labelCount; i++) {
      const percent = i / (labelCount - 1);
      const x = MathUtils.lerp(
        this.x - this.size / 2,
        this.x + this.size / 2 - offset * 2,
        percent,
      );

      const label = new paper.PointText({
        point: [x, this.y + this.size / 2 + this.settings.legendOffset * 2], // 10px below the graph border
        content: Math.round(
          MathUtils.lerp(
            this.settings.frequencyStart,
            this.settings.frequencyEnd,
            percent,
          ),
        ),
        fillColor: this.settings.color,
        fontSize: this.settings.legendFontSize,
        justification: "left",
      });

      this.group.addChild(label);
    }
  }

  drawFrequency() {}
}

export class GraphGUI extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: Graph,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Graph" });
  }
}
