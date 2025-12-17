import { Box2, Clock, MathUtils, Vector2 } from "three";
import { FolderApi } from "tweakpane";

import GUIController from "@utils/editor/gui/gui";
import { TWO_PI } from "@utils/three/math";
import Photon from "./photon";
import {
  QuantumInterferenceSettings,
  quantumWaveCanvas,
} from "./quantum-interference-geometry";

export default class QuantumInterferance {
  settings: QuantumInterferenceSettings = {
    blueprint: {
      darkness: true,
    },
    form: {
      emitters: 2,
      waves: 10,
      jitter: 5,
      jitterEnabled: true,
      power: 3,
    },
  };

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  clock = new Clock();

  dpi = window.devicePixelRatio || 1;

  size: Vector2; // canvas size

  phase = 0;

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.resize();

    this.size = new Vector2(
      this.canvas.width / this.dpi,
      this.canvas.height / this.dpi,
    );

    this.draw();
  }

  resize() {
    const width = 500;
    const height = 500;
    this.canvas.width = width * this.dpi;
    this.canvas.height = height * this.dpi;
    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      this.ctx.scale(this.dpi, this.dpi); // Apply DPI scaling
    }
  }

  draw = () => {
    // Circle
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.size.x, this.size.y);

    this.phase -= TWO_PI * 0.05;

    const radius = this.size.x / 2;
    for (let i = 0; i < this.settings.form.emitters; i++) {
      const theta = i * (TWO_PI / this.settings.form.emitters);
      const x = this.size.x / 2 + Math.cos(theta) * radius;
      const y = this.size.y / 2 + Math.sin(theta) * radius;
      this.quantumWave(x, y, radius * 2, theta);
    }
  };

  quantumWave(
    centerX: number,
    centerY: number,
    radius: number,
    phaseOffset: number,
  ) {
    if (!this.ctx) return;

    const count = 200;
    const steps = 300;
    for (let i = 0; i < count; i++) {
      const t = i / count;

      const raySx = centerX;
      const raySy = centerY;

      const theta = t * TWO_PI;
      const rayDx = centerX + Math.cos(theta) * radius;
      const rayDy = centerY + Math.sin(theta) * radius;

      for (let j = 0; j < steps; j++) {
        const progress = j / steps;
        const x = MathUtils.lerp(raySx, rayDx, progress);
        const y = MathUtils.lerp(raySy, rayDy, progress);

        const waveOpacity = Math.pow(
          Math.sin(this.phase + progress * TWO_PI * this.settings.form.waves) *
            0.5 +
            0.5,
          this.settings.form.power,
        );

        const jitterX = MathUtils.randFloatSpread(
          this.settings.form.jitterEnabled ? this.settings.form.jitter : 0,
        );
        const jitterY = MathUtils.randFloatSpread(
          this.settings.form.jitterEnabled ? this.settings.form.jitter : 0,
        );

        this.ctx.beginPath();
        this.ctx.arc(x + jitterX, y + jitterY, 0.5, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * (waveOpacity + Math.sin(theta * TWO_PI + this.phase) * 0.5 + 0.5)})`;
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
  }
}

export class QuantumInterferanceGUI extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: QuantumInterferance,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Quantum Interference" });

    // Blueprint
    this.folders.blueprint = this.addFolder(this.gui, { title: "Blueprint" });

    this.folders.blueprint.addBinding(target.settings.blueprint, "darkness");

    // Form
    this.folders.form = this.addFolder(this.gui, { title: "Form" });
    this.folders.form.addButton({ title: "Draw" }).on("click", target.draw);

    this.folders.form
      .addBinding(target.settings.form, "emitters", { min: 1, max: 8, step: 1 })
      .on("change", target.draw);
    this.folders.form
      .addBinding(target.settings.form, "waves", { min: 1, max: 50, step: 1 })
      .on("change", target.draw);
    this.folders.form
      .addBinding(target.settings.form, "jitter", { min: 1, max: 50 })
      .on("change", target.draw);
    this.folders.form
      .addBinding(target.settings.form, "jitterEnabled")
      .on("change", target.draw);
    this.folders.form
      .addBinding(target.settings.form, "power", { min: 0, max: 10 })
      .on("change", target.draw);
  }
}
