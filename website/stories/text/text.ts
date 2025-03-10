import paper from "paper";
import { FolderApi, Pane } from "tweakpane";

import { composite, saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import Identity, { IdentityGUI } from "../identity/identity";

export default class Text {
  settings = {
    darkness: false,
    text: {
      size: 0.0735,
      color: "#ffffff", // eb0000
      letterSpacing: 0.004325,
    },
    debug: {
      width: 1,
      color: "#ff0000",
      enabled: false,
    },
  };

  textCanvas: HTMLCanvasElement;
  textCtx: CanvasRenderingContext2D | null;

  constructor(
    public root?: HTMLElement,
    public title: string = "IXIIIIIXI",
  ) {
    // Canvas
    this.textCanvas = document.createElement("canvas");
    this.textCtx = this.textCanvas.getContext("2d");

    root?.appendChild(this.textCanvas);

    document.fonts.ready.then(() => {
      this.setup();
    });
  }

  async setup(width: number = 500, height: number = 500, scale = 1) {
    return new Promise<void>((resolve) => {
      this.textCanvas.width = width * scale;
      this.textCanvas.height = height * scale;
      this.textCtx?.scale(2, 2);

      Object.assign(this.textCanvas.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: `${this.textCanvas.width / 2}px`,
        height: `${this.textCanvas.height / 2}px`,
        border: "1px solid white",
      });

      this.draw();
      resolve();
    });
  }

  draw = () => {
    if (!this.textCtx) return;

    this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);

    // create a rectangle to fill the background
    if (this.settings.darkness) {
      this.textCtx.fillStyle = "#000000";
      this.textCtx.fillRect(
        0,
        0,
        this.textCanvas.width,
        this.textCanvas.height,
      );
    }

    const width = this.textCanvas.width;
    const height = this.textCanvas.height;
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

    const fontSize = this.settings.text.size * this.textCanvas.height;
    this.textCtx.font = `${fontSize}px 'Berlingske Serif Regular'`;
    this.textCtx.fillStyle = "#ffffff";
    this.textCtx.letterSpacing = `${this.settings.text.letterSpacing * fontSize}px`;

    const metrics = this.textCtx.measureText(this.title);

    const textWidth =
      metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft;
    const textHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    console.log(textWidth, width);

    this.textCtx.fillStyle = this.settings.text.color;
    this.textCtx.fillText(
      this.title,
      centerX - textWidth / 2,
      centerY + textHeight / 2,
    );
  };

  async saveImage() {
    await this.setup(true);

    await saveImage(this.textCanvas, "text");

    await this.setup(false);
  }

  saveSVG = () => {
    saveSVG(paper.project, "text");
  };
}

export class TextGUI extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: Text,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Text" });

    this.gui.addButton({ title: "Draw", label: "" }).on("click", target.draw);
    this.gui.addButton({ title: "Save Image", label: "" }).on("click", () => {
      target.saveImage();
    });
    this.gui.addBinding(target.settings, "darkness").on("change", target.draw);
    this.gui
      .addBinding(target.settings.debug, "enabled", { label: "guidelines" })
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
  }
}
