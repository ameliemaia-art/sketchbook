import { FolderApi } from "tweakpane";

import GUIController from "@utils/editor/gui/gui";
import { TWO_PI } from "@utils/three/math";
import {
  quantumWaveCanvas,
  QuantumWavesSettings,
} from "./quantum-waves-geometry";

export default class QuantumWaves {
  settings: QuantumWavesSettings = {
    blueprint: {
      darkness: true,
    },
    form: {
      emitters: 2,
      waves: 10,
      jitter: 10,
      opacity: 0.5,
      enableJitter: true,
      waveThickness: 50,
      waveJitter: 10,
      pointsPerPositionOnWave: 50,
      particleSize: { x: 0.5, y: 0.5 },
    },
  };

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;

  dpi = window.devicePixelRatio || 1;

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    this.draw();

    // Todo - better wave function implementation
    // better opacity ramp falloff
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
    const ctx = this.ctx;
    const width = this.canvas.width / this.dpi;
    const height = this.canvas.height / this.dpi;
    const radius = width / 2;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set background
    if (this.settings.blueprint.darkness) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);
    }

    // ctx.beginPath();
    // ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    // ctx.strokeStyle = "#ffffff";
    // ctx.lineWidth = 2;
    // ctx.stroke();

    for (let i = 0; i < this.settings.form.emitters; i++) {
      const angle = i * (TWO_PI / this.settings.form.emitters);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      quantumWaveCanvas(ctx, { x: x, y: y }, radius * 2, this.settings);
    }
  };

  quantumWave() {}
}

export class QuantumWavesGUI extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: QuantumWaves,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Quantum Waves" });

    // Blueprint
    this.folders.blueprint = this.addFolder(this.gui, { title: "Blueprint" });

    this.folders.blueprint
      .addBinding(target.settings.blueprint, "darkness")
      .on("change", target.draw);

    // Form
    this.folders.form = this.addFolder(this.gui, { title: "Form" });

    this.folders.form
      .addBinding(target.settings.form, "emitters", {
        min: 1,
        max: 10,
        step: 1,
      })
      .on("change", target.draw);
    this.folders.form
      .addBinding(target.settings.form, "waves", { min: 1, max: 50, step: 1 })
      .on("change", target.draw);

    this.folders.form
      .addBinding(target.settings.form, "enableJitter")
      .on("change", target.draw);
    this.folders.form
      .addBinding(target.settings.form, "jitter", { min: 0, max: 20 })
      .on("change", target.draw);
    this.folders.form
      .addBinding(target.settings.form, "opacity", { min: 0, max: 1 })
      .on("change", target.draw);
    this.folders.form
      .addBinding(target.settings.form, "waveThickness", { min: 1, max: 100 })
      .on("change", target.draw);

    this.folders.form
      .addBinding(target.settings.form, "waveJitter", { min: 0, max: 40 })
      .on("change", target.draw);

    this.folders.form
      .addBinding(target.settings.form, "pointsPerPositionOnWave", {
        min: 1,
        max: 100,
        step: 1,
      })
      .on("change", target.draw);

    this.folders.form
      .addBinding(target.settings.form.particleSize, "x", {
        min: 0.01,
        max: 1,
        label: "particleSize.x",
      })
      .on("change", target.draw);
    this.folders.form
      .addBinding(target.settings.form.particleSize, "y", {
        min: 0.01,
        max: 1,
        label: "particleSize.y",
      })
      .on("change", target.draw);
  }
}
