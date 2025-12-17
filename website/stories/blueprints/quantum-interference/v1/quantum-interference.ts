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
  clock = new Clock();

  dpi = window.devicePixelRatio || 1;

  size: Vector2; // canvas size

  photon: Photon;

  count = 0;
  max = 200;

  phase = 0;

  interval: any = null;

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

    this.photon = new Photon(this.ctx!, this.size);

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

    // this.photon.draw();

    this.phase -= TWO_PI * 0.1;

    const count = 4;
    const radius = this.size.x / 2;
    for (let i = 0; i < count; i++) {
      const theta = i * (TWO_PI / count);
      const x = this.size.x / 2 + Math.cos(theta) * radius;
      const y = this.size.y / 2 + Math.sin(theta) * radius;
      this.quantumWave(x, y, radius * 2);
    }
  };

  quantumWave(centerX: number, centerY: number, radius: number) {
    if (!this.ctx) return;

    const count = 200;
    const steps = 200;
    for (let i = 0; i < count; i++) {
      const t = i / count;

      const raySx = centerX;
      const raySy = centerY;

      const theta = t * TWO_PI;
      const rayDx = centerX + Math.cos(theta) * radius;
      const rayDy = centerY + Math.sin(theta) * radius;

      const waveCount = 25;

      for (let j = 0; j < steps; j++) {
        const progress = j / steps;
        const x = MathUtils.lerp(raySx, rayDx, progress);
        const y = MathUtils.lerp(raySy, rayDy, progress);

        const waveOpacity =
          Math.sin(this.phase + progress * TWO_PI * waveCount) * 0.5 + 0.5;

        this.ctx.beginPath();
        this.ctx.arc(
          // x,
          // y,
          x + MathUtils.randFloatSpread(5),
          y + MathUtils.randFloatSpread(5),
          0.5,
          0,
          Math.PI * 2,
        );
        this.ctx.fillStyle = `rgba(255, 255, 255, ${waveOpacity})`;
        this.ctx.fill();
        this.ctx.closePath();
      }

      // this.ctx.beginPath();
      // this.ctx.lineWidth = 1;
      // this.ctx.strokeStyle = `rgba(255, 255, 255, ${waveOpacity})`;
      // this.ctx.moveTo(this.size.x / 2, this.size.y / 2);
      // this.ctx.lineTo(x, y);
      // this.ctx.stroke();
      // this.ctx.closePath();
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
  }
}
