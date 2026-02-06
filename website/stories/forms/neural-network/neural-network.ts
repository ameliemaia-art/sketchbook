import Frame, { GUIFrame } from "@/stories/frame/frame";
import { Clock, MathUtils, Vector2 } from "three";
import { seededRandom } from "three/src/math/MathUtils.js";
import { FolderApi } from "tweakpane";

import { createGrid } from "@utils/canvas/utils";
import { saveImage, saveJsonFile } from "@utils/common/file";
import GUIController from "@utils/editor/gui/gui";
import { generateBindingOptions } from "@utils/editor/gui/gui-utils";
import blueprint from "../blueprint/blueprint";
import { NeutralNetworkSettings } from "./neural-network-geometry";
import Ray, { GUIRay } from "./ray";

enum PresetName {
  MAIN = "Main",
  WAVES = "Waves",
  DIMENSIONAL = "Dimensional",
  RAYS = "Rays",
  SINGLE = "Single",
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default class NeutralNetwork {
  title = "Neutral Network";

  isExporting = false;

  settings: NeutralNetworkSettings = {
    scale: 1,
    seed: 5,
    blueprint: {
      darkness: true,
    },
    grid: {
      visible: true,
      strokeWidth: 0.5,
      divisions: 50,
      opacity: 0.1,
    },
    form: {},
  };

  ctx: CanvasRenderingContext2D | null;
  dpi = MathUtils.clamp(window.devicePixelRatio, 1, 2);
  size = new Vector2();
  frameEnabled = false;
  frame: Frame;

  rays: Ray[] = [];

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    this.ctx = this.canvas.getContext("2d");

    this.frame = new Frame(root, this.canvas, this.title);
    this.size.set(this.canvas.width, this.canvas.height);

    const sides = [
      [new Vector2(0, 0), new Vector2(1, 0)], // Top edge
      [new Vector2(1, 0), new Vector2(1, 1)], // Right edge
      [new Vector2(1, 1), new Vector2(0, 1)], // Bottom edge
      [new Vector2(0, 1), new Vector2(0, 0)], // Left edge
    ];

    sides.forEach((side, i) => {
      this.rays[i] = new Ray(side[0], side[1]);
    });

    this.setup();
  }

  async setup(exporting = false) {
    const exportScale = this.frameEnabled ? 3 : 5;
    await this.frame.setup(exporting);
    return new Promise<void>((resolve) => {
      const scale = exporting ? exportScale : 1;
      this.settings.scale = scale;

      const width = 1000 * scale;
      const height = 500 * scale;
      this.canvas.width = width * this.dpi;
      this.canvas.height = height * this.dpi;
      this.canvas.style.width = width + "px";
      this.canvas.style.height = height + "px";
      this.size.set(width, height);
      if (this.ctx) {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        this.ctx.scale(this.dpi, this.dpi); // Apply DPI scaling
      }

      requestAnimationFrame(() => {
        this.render().then(() => {
          resolve();
        });
      });
    });
  }

  async render() {
    if (!this.ctx) return;

    this.draw();
  }

  async draw() {
    if (!this.ctx) return;

    seededRandom(this.settings.seed);

    if (this.settings.blueprint.darkness) {
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(0, 0, this.size.x, this.size.y);
    } else {
      this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    }

    // Draw grid
    if (this.settings.grid.visible) {
      createGrid(
        this.ctx,
        new Vector2(this.size.x / 2, this.size.y / 2),
        this.size,
        [1, 1, 1, this.settings.grid.opacity],
        this.settings.grid.strokeWidth,
        this.settings.grid.divisions * 2,
        this.settings.grid.divisions,
      );
      createGrid(
        this.ctx,
        new Vector2(this.size.x / 2, this.size.y / 2),
        this.size,
        [1, 1, 1, this.settings.grid.opacity],
        this.settings.grid.strokeWidth,
        10,
        5,
      );
    }

    // Draw rays
    this.rays.forEach((ray) => {
      ray.draw(this.ctx!, this.size);
    });

    // Frame
    this.frame.toggle(this.frameEnabled);

    if (this.frameEnabled) {
      this.frame.draw();
    }
  }

  name() {
    return this.title;
  }

  fileName() {
    return this.name().replace(/ /g, "-").toLowerCase();
  }

  async saveImage() {
    this.isExporting = true;

    await this.setup(true);

    if (this.frameEnabled) {
      await saveImage(this.frame.textCanvas, this.fileName());
    } else {
      await saveImage(this.canvas, this.fileName());
    }

    this.isExporting = false;

    await this.setup(false);
  }
}

export class NeutralNetworkGUI extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: NeutralNetwork,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Quantum Waves" });

    const render = () => {
      if (!this.target.isExporting) {
        this.target.render();
      }
    };

    // Blueprint
    this.folders.blueprint = this.addFolder(this.gui, { title: "Blueprint" });
    this.folders.blueprint
      .addBinding(target.settings.blueprint, "darkness")
      .on("change", render);

    this.controllers.ray0 = new GUIRay(
      this.folders.blueprint,
      target.rays[0],
      "Top Ray",
      render,
    );
    this.controllers.ray1 = new GUIRay(
      this.folders.blueprint,
      target.rays[1],
      "Right Ray",
      render,
    );
    this.controllers.ray2 = new GUIRay(
      this.folders.blueprint,
      target.rays[2],
      "Bottom Ray",
      render,
    );
    this.controllers.ray3 = new GUIRay(
      this.folders.blueprint,
      target.rays[3],
      "Left Ray",
      render,
    );
  }
}
