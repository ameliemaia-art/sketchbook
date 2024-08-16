import paper from "paper";
import { FolderApi, Pane } from "tweakpane";

import { composite, saveImage } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import Identity, { IdentityGUI } from "../identity/identity";

// Adjust this if canvas size changes
// 512 = 1 for original logo
const strokeScale = 1;

export default class WordmarkAlternative {
  settings = {
    scale: 0.5,
    text: {
      size: 0.1455,
      color: "#ffffff",
      lineSpacing: 0.1,
      letterSpacing: 0.01,
    },
    debug: {
      width: 1,
      color: "#ffffff",
      enabled: false,
    },
  };

  identity: Identity;

  textCanvas: HTMLCanvasElement;
  textCtx: CanvasRenderingContext2D | null;

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    this.canvas = canvas;

    canvas.width = 500;
    canvas.height = 500;
    paper.setup(canvas);

    this.identity = new Identity(canvas, false);

    // Canvas
    this.textCanvas = document.createElement("canvas");
    this.textCtx = this.textCanvas.getContext("2d");
    this.textCanvas.width = canvas.width;
    this.textCanvas.height = canvas.height;
    this.textCtx?.scale(2, 2);

    Object.assign(this.textCanvas.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: `${canvas.width / 2}px`,
      height: `${canvas.height / 2}px`,
    });

    root.appendChild(this.textCanvas);

    document.fonts.ready.then(() => {
      this.draw();
    });
  }

  draw = () => {
    if (!this.textCtx) return;
    paper.project.activeLayer.removeChildren();

    this.identity.draw();

    this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);

    const width = this.textCanvas.width;
    const height = this.textCanvas.width;
    const centerX = this.textCanvas.width / 4;
    const centerY = this.textCanvas.height / 4;

    // Horizontal line
    if (this.settings.debug.enabled) {
      this.textCtx.beginPath();
      this.textCtx.lineWidth = this.settings.debug.width;
      this.textCtx.strokeStyle = this.settings.debug.color;
      this.textCtx.moveTo(0, centerY);
      this.textCtx.lineTo(width, centerY);
      this.textCtx.stroke();

      // Vertical line
      this.textCtx.beginPath();
      this.textCtx.lineWidth = this.settings.debug.width;
      this.textCtx.strokeStyle = this.settings.debug.color;
      this.textCtx.moveTo(centerX, 0);
      this.textCtx.lineTo(centerX, height);
      this.textCtx.stroke();
    }

    // Text
    const lines = [
      //
      "I",
      "XIII",
      "I X I",
      "IIIX",
      "I",
    ];

    const fontSize = this.settings.text.size * this.canvas.height;

    this.textCtx.font = `${fontSize}px 'Berlingske Serif Text'`;
    this.textCtx.fillStyle = this.settings.text.color;
    this.textCtx.letterSpacing = `${this.settings.text.letterSpacing * this.canvas.height}px`;

    this.textCtx?.save();
    // this.textCtx?.scale(2 * this.settings.scale, 2 * this.settings.scale);

    this.textCtx.translate(centerX, centerY);
    this.textCtx.scale(2 * this.settings.scale, 2 * this.settings.scale);
    this.textCtx.translate(-centerX, -centerY);

    const lineSpacing = this.settings.text.lineSpacing * this.canvas.height;

    // Calculate the total height of the text block
    const totalHeight = (lines.length - 1) * lineSpacing;
    const startY = centerY - totalHeight / 2;

    // Calculate X positions for centering each line
    const xPositions = lines.map((line) => {
      const metrics = this.textCtx.measureText(line);

      const textWidth =
        metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft;
      return centerX - textWidth / 2;
    });

    // Draw each line of text on the canvas
    lines.forEach((line, index) => {
      const { actualBoundingBoxAscent, actualBoundingBoxDescent } =
        this.textCtx.measureText(line);
      const textHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;
      const yPos = startY + index * lineSpacing + textHeight / 2;
      this.textCtx.fillText(line, xPositions[index], yPos);
    });

    this.textCtx?.restore();
  };

  export = () => {
    const composition = composite(this.canvas.width, this.canvas.height, [
      this.canvas,
      this.textCanvas,
    ]);
    saveImage(composition, "wordmark");
  };
}

export class WordmarkAlternativeGUI extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: WordmarkAlternative,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Wordmark" });

    this.gui.addButton({ title: "Draw" }).on("click", target.draw);
    this.gui.addButton({ title: "Export" }).on("click", target.export);
    this.gui
      .addBinding(target.settings.debug, "enabled")
      .on("change", target.draw);

    this.gui
      .addBinding(target.settings, "scale", { min: 0, max: 1 })
      .on("change", target.draw);

    const text = this.gui.addFolder({ title: "Text" });

    text.addBinding(target.settings.text, "color").on("change", target.draw);

    text
      .addBinding(target.settings.text, "lineSpacing", { min: 0, max: 0.5 })
      .on("change", target.draw);

    text
      .addBinding(target.settings.text, "letterSpacing", { min: 0, max: 0.1 })
      .on("change", target.draw);

    text
      .addBinding(target.settings.text, "size", { min: 0, max: 0.5 })
      .on("change", target.draw);

    new IdentityGUI(gui, target.identity);
  }
}
