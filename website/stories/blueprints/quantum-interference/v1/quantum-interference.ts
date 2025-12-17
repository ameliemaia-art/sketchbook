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

  interval: any = null;

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.resize();

    this.canvasWidth = this.canvas.width / this.dpi;
    this.canvasHeight = this.canvas.height / this.dpi;
    this.size = new Vector2(this.canvasWidth, this.canvasHeight);

    this.photon = new Photon(this.ctx!, this.size);

    this.startSimulation();

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

  randomizePhoton() {
    this.photon.setOrigin(this.size.x / 2, 0);
    this.photon.setDirection(0, 1);
    this.photon.setPhase(MathUtils.randFloat(0, TWO_PI));
  }

  startSimulation() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.size.x, this.size.y);

    if (this.settings.blueprint.darkness) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
      this.ctx.fillRect(0, 0, this.size.x, this.size.y);
    }
    this.interval = setInterval(() => {
      this.photon.setOrigin(this.size.x / 2, this.size.y / 2);

      const t = this.count / (this.max - 1);
      const theta = MathUtils.lerp(
        MathUtils.degToRad(360),
        MathUtils.degToRad(0),
        t,
      );
      this.photon.setDirection(Math.cos(theta), Math.sin(theta));
      this.photon.setPhase(MathUtils.randFloat(0, TWO_PI));

      requestAnimationFrame(this.draw);
    }, 10);
  }

  randomize = () => {
    this.randomizePhoton();
    this.draw();
  };

  draw = () => {
    // Circle
    if (!this.ctx) return;

    this.photon.draw();

    if (this.count >= this.max) {
      clearInterval(this.interval);
    }

    this.count++;
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
    this.folders.form
      .addButton({ title: "randomize", label: "" })
      .on("click", target.randomize);

    this.folders.form.addBinding(target, "count", { readonly: true });
  }
}
