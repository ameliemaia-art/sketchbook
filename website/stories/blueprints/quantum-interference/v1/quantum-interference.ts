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

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.resize();

    const canvasWidth = this.canvas.width / this.dpi;
    const canvasHeight = this.canvas.height / this.dpi;

    this.size = new Vector2(canvasWidth, canvasHeight);

    this.photon = new Photon(this.ctx!, this.size);
    this.photon.origin.set(canvasWidth / 2, canvasHeight / 2);
    this.photon.direction.set(
      MathUtils.randFloatSpread(1),
      MathUtils.randFloatSpread(1),
    );
    this.photon.direction.normalize();

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

    requestAnimationFrame(this.draw);

    const ctx = this.ctx;
    const width = this.canvas.width / this.dpi;
    const height = this.canvas.height / this.dpi;
    // const radius = width / 2;
    // const centerX = width / 2;
    // const centerY = height / 2;

    // Clear canvas
    // ctx.clearRect(0, 0, width, height);

    // Set background
    if (this.settings.blueprint.darkness) {
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, width, height);
    }

    this.photon.draw(this.clock.getDelta());

    // ctx.beginPath();
    // ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    // ctx.strokeStyle = "#ffffff";
    // ctx.lineWidth = 2;
    // ctx.stroke();
  };
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

    this.folders.form.addBinding(target.settings.form, "emitters", {
      min: 1,
      max: 10,
      step: 1,
    });

    this.folders.form.addBinding(target.settings.form, "waves", {
      min: 1,
      max: 50,
      step: 1,
    });

    this.folders.form.addBinding(target.settings.form, "enableJitter");

    this.folders.form.addBinding(target.settings.form, "jitter", {
      min: 0,
      max: 20,
    });

    this.folders.form.addBinding(target.settings.form, "opacity", {
      min: 0,
      max: 1,
    });

    this.folders.form.addBinding(target.settings.form, "waveThickness", {
      min: 1,
      max: 100,
    });

    this.folders.form.addBinding(target.settings.form, "waveJitter", {
      min: 0,
      max: 40,
    });

    this.folders.form.addBinding(
      target.settings.form,
      "pointsPerPositionOnWave",
      {
        min: 1,
        max: 100,
        step: 1,
      },
    );

    this.folders.form.addBinding(target.settings.form.particleSize, "x", {
      min: 0.01,
      max: 1,
      label: "particleSize.x",
    });

    this.folders.form.addBinding(target.settings.form.particleSize, "y", {
      min: 0.01,
      max: 1,
      label: "particleSize.y",
    });
  }
}
