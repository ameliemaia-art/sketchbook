import { FolderApi, Pane } from "tweakpane";

import { composite, saveImage } from "@utils/common/file";
import GUIController from "@utils/gui/gui";

export default class Frame {
  settings = {
    darkness: false,
    imageScale: 0.05,
  };

  assets: {
    [key: string]: HTMLImageElement;
  } = {};

  textCanvas: HTMLCanvasElement;
  textCtx: CanvasRenderingContext2D | null;
  visible = false;

  constructor(root: HTMLElement) {
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
      const scale = exporting ? 5 : 1;

      this.textCanvas.width = 500 * scale;
      this.textCanvas.height = 500 * scale;
      this.textCtx?.scale(2, 2);

      Object.assign(this.textCanvas.style, {
        position: "absolute",
        top: "0",
        left: "0",
        // width: `${this.textCanvas.width / 2}px`,
        // height: `${this.textCanvas.height / 2}px`,
        // border: "1px solid white",
      });

      requestAnimationFrame(() => {
        this.draw();
        resolve();
      });
    });
  }

  draw = () => {
    if (!this.textCtx) return;

    if (!this.visible) return;

    if (this.settings.darkness) {
      this.textCtx.fillStyle = "#000000";
      this.textCtx.fillRect(
        0,
        0,
        this.textCanvas.width,
        this.textCanvas.height,
      );
    }

    this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);

    const size = this.textCanvas.width * this.settings.imageScale;
    const width = this.textCanvas.width / 2;
    const height = this.textCanvas.height / 2;

    // this.textCtx.drawImage(
    //   this.assets.title,
    //   width / 2 - size / 2,
    //   0,
    //   size,
    //   size,
    // );
    // this.drawRect(width / 2 - size / 2, height - size, size, size);
    // this.drawRect(0, height - size, size, size);
    // this.drawRect(width - size, height - size, size, size);
    this.textCtx.drawImage(this.assets.year, 0, height - size, size, size);
    this.textCtx.drawImage(
      this.assets.wordmark,
      width - size,
      height - size,
      size,
      size,
    );
  };

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
