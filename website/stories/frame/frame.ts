import { FolderApi, Pane } from "tweakpane";

import { composite, saveImage } from "@utils/common/file";
import GUIController from "@utils/gui/gui";

export default class Frame {
  settings = {
    darkness: true,
    imageScale: 0.1,
  };

  assets: {
    [key: string]: HTMLImageElement;
  } = {};

  textCanvas: HTMLCanvasElement;
  textCtx: CanvasRenderingContext2D | null;
  visible = true;

  constructor(
    root: HTMLElement,
    public sketchCanvas: HTMLCanvasElement,
  ) {
    // Canvas
    this.textCanvas = document.createElement("canvas");
    this.textCtx = this.textCanvas.getContext("2d");

    root.appendChild(this.textCanvas);

    document.fonts.ready.then(() => {
      this.setup();
    });
  }

  async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = src;
    });
  }

  async loadAssets() {
    this.assets.title = await this.loadImage("/assets/images/frame/title.png");
    this.assets.year = await this.loadImage("/assets/images/frame/year.png");
    this.assets.wordmark = await this.loadImage(
      "/assets/images/frame/wordmark.png",
    );
  }

  async setup(exporting = false) {
    await this.loadAssets();
    return new Promise<void>((resolve) => {
      const scale = exporting ? 3 : 1;

      this.textCanvas.width = 1080 * scale;
      this.textCanvas.height = 1920 * scale;
      this.textCtx?.scale(2, 2);

      Object.assign(this.textCanvas.style, {
        position: "absolute",
        top: "0",
        left: "520px",
        width: `${500 * (9 / 16)}px`,
        height: `${500}px`,
        // border: "1px solid white",
      });

      requestAnimationFrame(() => {
        this.draw();
        resolve();
      });
    });
  }

  toggle(visible: boolean) {
    this.textCanvas.style.display = visible ? "" : "none";
  }

  draw = () => {
    if (!this.textCtx) return;

    if (!this.visible) return;

    this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);

    if (this.settings.darkness) {
      this.textCtx.fillStyle = "#000000";
      this.textCtx.fillRect(
        0,
        0,
        this.textCanvas.width,
        this.textCanvas.height,
      );
    }

    const size = this.textCanvas.width * this.settings.imageScale;
    const width = this.textCanvas.width / 2;
    const height = this.textCanvas.height / 2;
    const outline = false;

    this.drawImage(
      this.assets.title,
      width / 2 - size / 2,
      size,
      size,
      size,
      outline,
    );

    this.drawImage(this.assets.year, 0, height - size, size, size, outline);

    this.drawImage(
      this.assets.wordmark,
      width - size,
      height - size,
      size,
      size,
      outline,
    );

    this.drawImage(
      this.sketchCanvas,
      0,
      height / 2 - width / 2,
      width,
      width,
      outline,
    );
  };

  drawImage(
    image: HTMLCanvasElement | HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    outline: boolean,
  ) {
    if (!this.textCtx) return;
    this.textCtx.drawImage(image, x, y, width, height);

    if (outline) {
      this.drawRect(x, y, width, height);
    }
  }

  drawRect(x: number, y: number, width: number, height: number) {
    if (!this.textCtx) return;
    this.textCtx.beginPath();
    this.textCtx.strokeStyle = "white";
    this.textCtx.lineWidth = 0.5;
    this.textCtx.rect(x, y, width, height);
    this.textCtx.stroke();
    this.textCtx.closePath();
  }

  async saveImage() {
    await this.setup(true);

    const composition = composite(
      this.textCanvas.width,
      this.textCanvas.height,
      [this.textCanvas],
      false,
    );
    await saveImage(composition, "frame");

    await this.setup(false);
  }
}

export class GUIFrame extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: Frame,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Frame" });

    this.gui.addButton({ title: "Draw", label: "" }).on("click", target.draw);
    this.gui.addButton({ title: "Save Image", label: "" }).on("click", () => {
      target.saveImage();
    });
    this.gui.addBinding(target.settings, "darkness").on("change", target.draw);
    this.gui
      .addBinding(target.settings, "imageScale", { min: 0, max: 1 })
      .on("change", target.draw);
  }
}
