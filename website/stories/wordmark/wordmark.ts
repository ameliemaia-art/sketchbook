import paper from "paper";
import { FolderApi, Pane } from "tweakpane";

import { composite, saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import Identity, { IdentityGUI } from "../identity/identity";

// Adjust this if canvas size changes
// 512 = 1 for original logo
const strokeScale = 1;

export default class Wordmark {
  settings = {
    text: {
      size: 0.0735,
      color: "#ffffff", // eb0000
      letterSpacing: 0.004325,
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
    this.identity.settings.opacity = 0.25;

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
    const text = "IXIIIIIXI";

    const fontSize = this.settings.text.size * this.canvas.height;
    this.textCtx.font = `${fontSize}px 'Berlingske Serif Text'`;
    this.textCtx.fillStyle = "#ffffff";
    this.textCtx.letterSpacing = `${this.settings.text.letterSpacing * fontSize}px`;

    const metrics = this.textCtx.measureText(text);

    const textWidth =
      metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft;
    const textHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    this.textCtx.fillStyle = this.settings.text.color;
    this.textCtx.fillText(
      text,
      centerX - textWidth / 2,
      centerY + textHeight / 2,
    );
  };

  saveImage = () => {
    const composition = composite(
      this.canvas.width / 2,
      this.canvas.height / 2,
      [this.canvas, this.textCanvas],
    );

    // saveImage(this.canvas, "wordmark");
    saveImage(composition, "wordmark");
  };

  saveSVG = () => {
    saveSVG(paper.project, "wordmark");
  };
}

export class WordmarkGUI extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: Wordmark,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Wordmark" });

    this.gui.addButton({ title: "Draw" }).on("click", target.draw);
    this.gui.addButton({ title: "Save Image" }).on("click", target.saveImage);
    this.gui
      .addBinding(target.settings.debug, "enabled")
      .on("change", target.draw);

    const text = this.gui.addFolder({ title: "Text" });

    text.addBinding(target.settings.text, "color", {}).on("change", (event) => {
      target.draw();
    });

    text
      .addBinding(target.settings.text, "letterSpacing", {
        min: 0,
        max: 0.2,
        step: 0.00001,
      })
      .on("change", target.draw);

    text
      .addBinding(target.settings.text, "size", {
        min: 0,
        max: 0.1,
        step: 0.00001,
      })
      .on("change", target.draw);

    new IdentityGUI(gui, target.identity);
  }
}
