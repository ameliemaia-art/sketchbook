import paper from "paper";
import { MathUtils } from "three";
import { FolderApi } from "tweakpane";

import GUIController from "@utils/gui/gui";

export default class Graph {
  settings = {
    color: new paper.Color(1, 1, 1, 1),
    width: 0.5,
    hitDetectionWidth: 2,
    legendOffset: 10,
    legendFontSize: 10,
    frequencyStart: 2500,
    frequencyEnd: 4000,
    threshold: 0,
  };

  group!: paper.Group;

  constructor(
    public x: number,
    public y: number,
    public size: number,
  ) {}

  draw(fft: Uint8Array | undefined) {
    this.group = new paper.Group();

    const border = new paper.Path.Rectangle({
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size,
    });

    border.strokeColor = new paper.Color("rgba(255, 255, 255, 1)");
    border.strokeWidth = this.settings.width;

    // Draw legends
    this.drawAmplitudeLabels();
    this.drawFrequencyLabels();
    this.drawFrequency(fft);
  }

  drawAmplitudeLabels() {
    const labelCount = 3;

    for (let i = 0; i < labelCount; i++) {
      const y = MathUtils.lerp(
        this.y + this.size,
        this.y + this.settings.legendFontSize,
        i / (labelCount - 1),
      );
      const amplitudeValue = i / (labelCount - 1); // Scale from 1 at top to 0 at bottom

      const label = new paper.PointText({
        point: [this.x - this.settings.legendOffset, y], // 10px left of the graph border
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

    for (let i = 0; i < labelCount; i++) {
      const percent = i / (labelCount - 1);
      const x = MathUtils.lerp(this.x, this.x + this.size, percent);

      let justification = "center";
      if (i === 0) {
        justification = "left";
      } else if (i === labelCount - 1) {
        justification = "right";
      }

      const label = new paper.PointText({
        point: [x, this.y + this.size + this.settings.legendOffset * 2], // 10px below the graph border
        content: Math.round(
          MathUtils.lerp(
            this.settings.frequencyStart,
            this.settings.frequencyEnd,
            percent,
          ),
        ),
        fillColor: this.settings.color,
        fontSize: this.settings.legendFontSize,
        justification,
      });

      this.group.addChild(label);
    }
  }

  drawFrequency(fft: Uint8Array | undefined) {
    if (!fft) return;
    var segments: paper.Point[] = [];
    let hit = false;
    let maxFreq = 0;

    for (let i = 0; i < fft.length; i++) {
      const amplitude = fft[i] / 255;
      const x = MathUtils.lerp(
        this.x,
        this.x + this.size,
        i / (fft.length - 1),
      );

      const y = MathUtils.lerp(this.y + this.size, this.y, amplitude);
      segments.push(new paper.Point(x, y));

      if (amplitude >= this.settings.threshold && amplitude > maxFreq) {
        hit = true;
        maxFreq = amplitude;
      }
    }

    const line = new paper.Path(segments);
    line.strokeColor = new paper.Color("rgba(255, 255, 255, 1)");
    line.strokeWidth = this.settings.width;
    this.group.addChild(line);

    if (hit) {
      const y = MathUtils.lerp(
        this.y + this.size,
        this.y,
        this.settings.threshold,
      );
      const line = new paper.Path([
        new paper.Point(this.x, y),
        new paper.Point(this.x + this.size, y),
      ]);
      line.strokeColor = new paper.Color("rgba(255, 0, 0, 1)");
      line.strokeWidth = this.settings.hitDetectionWidth;
      this.group.addChild(line);
    }
  }
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
