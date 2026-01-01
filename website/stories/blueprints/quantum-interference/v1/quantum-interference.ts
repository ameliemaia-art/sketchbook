import Frame, { GUIFrame } from "@/stories/frame/frame";
import { Clock, MathUtils, Vector2 } from "three";
import { FolderApi } from "tweakpane";

import { saveImage, saveJsonFile } from "@utils/common/file";
import GUIController from "@utils/editor/gui/gui";
import { PI, TWO_PI } from "@utils/three/math";
import settings from "./data/preset-0.json";
import { QuantumInterferenceSettings } from "./quantum-interference-geometry";
import { drawDot, drawLine } from "./utils";

const tmp0 = new Vector2();
const tmp1 = new Vector2();
const p0 = new Vector2();
const p1 = new Vector2();
const p2 = new Vector2();
const p3 = new Vector2();
const normal = new Vector2();
const tangent = new Vector2();

export default class QuantumInterferance {
  title = "Quantum Interference";

  settings: QuantumInterferenceSettings = {
    scale: 1,
    blueprint: {
      darkness: true,
    },
    form: {
      lights: {
        count: 2,
        startAngle: 90,
        rays: 300,
      },
      waves: {
        count: 25,
        power: Math.PI,
        phase: 0,
      },
      photon: {
        radius: 0.3,
        density: 1,
      },
      quantum: {
        waveFunctionHeight: 10,
        waveLength: 20,
      },
    },
  };

  ctx: CanvasRenderingContext2D | null;
  dpi = MathUtils.clamp(window.devicePixelRatio, 1, 2);
  size: Vector2;
  frameEnabled = false;
  frame: Frame;

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    this.ctx = this.canvas.getContext("2d");

    this.frame = new Frame(root, this.canvas, this.title);
    this.size = new Vector2(this.canvas.width, this.canvas.height);

    // this.loadSettings();
    this.setup();
  }

  loadSettings() {
    this.settings.form = JSON.parse(JSON.stringify(settings));
  }

  async setup(exporting = false) {
    const exportScale = this.frameEnabled ? 3 : 5;
    await this.frame.setup(exporting);
    return new Promise<void>((resolve) => {
      const scale = exporting ? exportScale : 1;
      this.settings.scale = scale;

      const width = 500 * scale;
      const height = 500 * scale;
      this.canvas.width = width * this.dpi;
      this.canvas.height = height * this.dpi;
      this.canvas.style.width = width + "px";
      this.canvas.style.height = height + "px";
      this.size = new Vector2(width, height);
      if (this.ctx) {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        this.ctx.scale(this.dpi, this.dpi); // Apply DPI scaling
      }

      requestAnimationFrame(() => {
        this.draw();
        resolve();
      });
    });
  }

  draw = () => {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.size.x, this.size.y);

    const totalLights = this.settings.form.lights.count;
    const startAngle = MathUtils.degToRad(this.settings.form.lights.startAngle);

    const radius = this.size.x / 2;
    for (let i = 0; i < totalLights; i++) {
      const theta = startAngle + i * (TWO_PI / totalLights);
      const x = this.size.x / 2 + (Math.cos(theta) * radius) / 2;
      const y = this.size.y / 2 + (Math.sin(theta) * radius) / 2;
      this.quantumWave(x, y, radius * 3);
      // this.quantumWave(this.size.x / 2, this.size.y / 2, radius * 3);
    }

    this.frame.toggle(this.frameEnabled);

    if (this.frameEnabled) {
      this.frame.draw();
    }
  };

  computeRandomPointInWaveFunction(
    p0: Vector2,
    p1: Vector2,
    t: number,
    probability: number,
  ) {
    const pointAlongWaveX = MathUtils.lerp(p0.x, p1.x, t);
    const pointAlongWaveY = MathUtils.lerp(p0.y, p1.y, t);
    // drawDot(this.ctx, pointAlongWaveX, pointAlongWaveY, 2, "#ffffff");

    const waveHeight =
      Math.pow(Math.sin(Math.PI * t), 2) * this.waveFunctionHeight;

    const t0x = pointAlongWaveX + tangent.x * -waveHeight;
    const t0y = pointAlongWaveY + tangent.y * -waveHeight;
    const t1x = pointAlongWaveX + tangent.x * waveHeight;
    const t1y = pointAlongWaveY + tangent.y * waveHeight;

    // Random position along the tangent
    return {
      x: MathUtils.lerp(t0x, t1x, probability),
      y: MathUtils.lerp(t0y, t1y, probability),
      t0x,
      t0y,
      t1x,
      t1y,
    };
  }

  waveFunction(x: number, y: number, normal: Vector2, debug = false) {
    const waveLength =
      this.settings.form.quantum.waveLength * this.settings.scale;
    const halfWaveLength = waveLength / 2;
    // Back
    p0.set(x, y).add(new Vector2(-waveLength, -waveLength).multiply(normal));
    // Forward
    p1.set(x, y).add(new Vector2(waveLength, waveLength).multiply(normal));

    // Wave start
    p2.set(x, y).add(
      new Vector2(
        -waveLength - halfWaveLength,
        -waveLength - halfWaveLength,
      ).multiply(normal),
    );
    // Wave end
    p3.set(x, y).add(
      new Vector2(
        waveLength + halfWaveLength,
        waveLength + halfWaveLength,
      ).multiply(normal),
    );

    tangent.set(-normal.y, normal.x);

    // Draw dots for debugging

    if (debug) {
      const t0x = x + tangent.x * -waveLength;
      const t0y = y + tangent.y * -waveLength;
      const t1x = x + tangent.x * waveLength;
      const t1y = y + tangent.y * waveLength;

      // Middle center line
      // drawLine(this.ctx, t0x, t0y, t1x, t1y);

      // Draw steps along wave function distance
      const steps = 20;
      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);

        const {
          x: x0,
          y: y0,
          t0x,
          t0y,
          t1x,
          t1y,
        } = this.computeRandomPointInWaveFunction(p2, p3, t, Math.random());

        drawDot(this.ctx!, x0, y0, 2, "#ff0000");
        drawLine(this.ctx!, t0x, t0y, t1x, t1y);
      }

      drawDot(this.ctx, p0.x, p0.y, halfWaveLength, "#ffff00");
      drawDot(this.ctx, p1.x, p1.y, halfWaveLength, "#00ffff");
      drawDot(this.ctx, p2.x, p2.y, 5, "#ffffff");
      drawDot(this.ctx, p3.x, p3.y, 5, "#ffffff");
    }

    const { x: waveFunctionProbabilityX, y: waveFunctionProbabilityY } =
      this.computeRandomPointInWaveFunction(
        p2,
        p3,
        this.sampleTFromWaveFunction(),
        Math.random(),
      );

    return {
      waveFunctionProbabilityX,
      waveFunctionProbabilityY,
    };
  }

  samplePhaseFromSinSquared(): number {
    const u = Math.random(); // uniform [0,1]
    const root = Math.asin(Math.sqrt(u)); // inverse CDF
    const phase = Math.random() < 0.5 ? root : Math.PI - root; // reflect for symmetry
    return phase;
  }

  sampleTFromWaveFunction(): number {
    const phase = this.samplePhaseFromSinSquared();
    return phase / Math.PI;
  }

  quantumWave(centerX: number, centerY: number, radius: number) {
    if (!this.ctx) return;

    const phase = this.settings.form.waves.phase * TWO_PI;

    for (let i = 0; i < this.settings.form.lights.rays; i++) {
      const t = i / this.settings.form.lights.rays;

      // arc
      const theta = t * TWO_PI;
      const dx = centerX + Math.cos(theta) * radius;
      const dy = centerY + Math.sin(theta) * radius;

      // line length / px
      const length = tmp0.set(centerX, centerY).distanceTo(tmp1.set(dx, dy));
      const steps = Math.floor(length) / this.particleDensity;

      for (let j = 0; j < steps; j++) {
        const progress = j / steps;
        const x = MathUtils.lerp(centerX, dx, progress);
        const y = MathUtils.lerp(centerY, dy, progress);

        // photon wave from origin
        const waveOpacity = Math.pow(
          Math.sin(phase + progress * TWO_PI * this.settings.form.waves.count),
          this.settings.form.waves.power,
        );

        normal.set(dx - x, dy - y).normalize();

        const { waveFunctionProbabilityX, waveFunctionProbabilityY } =
          this.waveFunction(x, y, normal, false);
        // this.waveFunction(x, y, normal, j === 0);

        this.ctx.beginPath();
        this.ctx.arc(
          waveFunctionProbabilityX,
          waveFunctionProbabilityY,
          this.photonRadius,
          0,
          Math.PI * 2,
        );
        this.ctx.fillStyle = `rgba(255, 255, 255, ${MathUtils.clamp(waveOpacity, 0, 1)})`;
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
  }

  // Scale dependent settings
  get waveFunctionHeight() {
    return this.settings.scale * this.settings.form.quantum.waveFunctionHeight;
  }

  get particleDensity() {
    return this.settings.scale * this.settings.form.photon.density;
  }

  get photonRadius() {
    return this.settings.scale * this.settings.form.photon.radius;
  }

  name() {
    return this.title;
  }

  fileName() {
    return this.name().replace(/ /g, "-").toLowerCase();
  }

  async saveImage() {
    await this.setup(true);

    if (this.frameEnabled) {
      await saveImage(this.frame.textCanvas, this.fileName());
    } else {
      await saveImage(this.canvas, this.fileName());
    }

    await this.setup(false);
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
    this.folders.form
      .addButton({ title: "Draw", label: "" })
      .on("click", target.draw);
    this.folders.form
      .addButton({ title: "Save Settings", label: "" })
      .on("click", () => {
        this.saveSettings();
      });
    this.folders.form
      .addButton({ title: "Save Image", label: "" })
      .on("click", () => {
        target.saveImage();
      });

    this.folders.lights = this.addFolder(this.gui, { title: "Lights" });
    this.folders.lights
      .addBinding(target.settings.form.lights, "count", {
        min: 1,
        max: 8,
        step: 1,
      })
      .on("change", target.draw);
    this.folders.lights
      .addBinding(target.settings.form.lights, "startAngle", {
        min: 0,
        max: 360,
      })
      .on("change", target.draw);
    this.folders.lights
      .addBinding(target.settings.form.lights, "rays", {
        min: 1,
        max: 300,
        step: 1,
      })
      .on("change", target.draw);

    // Waves
    this.folders.waves = this.addFolder(this.gui, { title: "Waves" });
    this.folders.waves
      .addBinding(target.settings.form.waves, "count", {
        min: 1,
        max: 50,
        step: 1,
      })
      .on("change", target.draw);
    this.folders.form
      .addBinding(target.settings.form.waves, "power", { min: 0 })
      .on("change", target.draw);
    this.folders.form
      .addBinding(target.settings.form.waves, "phase", { min: 0, max: 1 })
      .on("change", target.draw);

    // Photon
    this.folders.photon = this.addFolder(this.gui, { title: "Photon" });
    this.folders.photon
      .addBinding(target.settings.form.photon, "radius", { min: 0, max: 1 })
      .on("change", target.draw);
    this.folders.form
      .addBinding(target.settings.form.photon, "density", {
        min: 1,
        max: 50,
        step: 1,
      })
      .on("change", target.draw);

    this.folders.quantum = this.addFolder(this.gui, { title: "Quantum" });

    this.folders.quantum
      .addBinding(target.settings.form.quantum, "waveFunctionHeight", {
        min: 0,
        max: 20,
      })
      .on("change", target.draw);
    this.folders.quantum
      .addBinding(target.settings.form.quantum, "waveLength", {
        min: 0,
        max: 20,
      })
      .on("change", target.draw);

    // Frame
    this.controllers.frame = new GUIFrame(this.gui, target.frame);
    this.controllers.frame.gui
      .addBinding(target, "frameEnabled", { label: "frame" })
      .on("change", target.draw);
  }

  saveSettings() {
    saveJsonFile(
      JSON.stringify(this.target.settings.form),
      this.target.fileName() + "-settings",
    );
  }
}
