import Frame, { GUIFrame } from "@/stories/frame/frame";
import { Clock, MathUtils, Vector2 } from "three";
import { seededRandom } from "three/src/math/MathUtils.js";
import { FolderApi } from "tweakpane";

import { saveImage, saveJsonFile } from "@utils/common/file";
import GUIController from "@utils/editor/gui/gui";
import { PI, TWO_PI } from "@utils/three/math";
import settings from "./data/preset-main.json";
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
const waveFnTmp0 = new Vector2();
const waveFnTmp1 = new Vector2();
const waveFnTmp2 = new Vector2();
const waveFnTmp3 = new Vector2();

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default class QuantumInterferance {
  title = "Quantum Waves";

  isExporting = false;
  renderCount = 0;
  opacityStep = 0;
  renderProgress = 0;

  settings: QuantumInterferenceSettings = {
    scale: 1,
    seed: 5,
    renderSteps: 25,
    accumulate: true,
    blueprint: {
      darkness: true,
    },
    form: {
      lights: {
        count: 2,
        startAngle: 0,
        rays: 500,
        offset: 1,
      },
      waves: {
        count: 25,
        power: Math.PI,
        phase: 130,
      },
      photon: {
        radius: 0.25,
        density: 1,
        opacity: 0.5,
      },
      quantum: {
        waveFunctionHeight: 10,
        waveLength: 20,
      },
    },
  };

  ctx: CanvasRenderingContext2D | null;
  dpi = MathUtils.clamp(window.devicePixelRatio, 1, 2);
  size = new Vector2();
  frameEnabled = false;
  frame: Frame;

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    this.ctx = this.canvas.getContext("2d");

    this.frame = new Frame(root, this.canvas, this.title);
    this.size.set(this.canvas.width, this.canvas.height);

    this.loadSettings();
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
      this.size.set(width, height);
      if (this.ctx) {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        this.ctx.scale(this.dpi, this.dpi); // Apply DPI scaling
      }

      requestAnimationFrame(() => {
        this.render().then(() => {
          console.log("complete!");

          resolve();
        });
      });
    });
  }

  async render() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.size.x, this.size.y);

    if (this.settings.accumulate) {
      this.renderCount = 0;
      this.opacityStep = (1 / this.settings.renderSteps) * Math.PI;
      for (let i = 0; i < this.settings.renderSteps; i++) {
        if (!this.settings.accumulate) break;

        this.renderCount = i;

        seededRandom(this.settings.seed + i);

        await new Promise<void>((resolve) => {
          requestAnimationFrame(async () => {
            await this.draw();
            resolve();
          });
        });

        await wait(1);
      }
    } else {
      this.opacityStep = 1;
      this.draw();
    }
  }

  async draw() {
    if (!this.ctx) return;

    this.renderProgress = this.renderCount / (this.settings.renderSteps - 1);

    const totalLights = this.settings.form.lights.count;
    const startAngle = MathUtils.degToRad(this.settings.form.lights.startAngle);

    const radius = this.size.x / 2;
    for (let i = 0; i < totalLights; i++) {
      const theta = startAngle + i * (TWO_PI / totalLights);
      const x =
        this.size.x / 2 +
        Math.cos(theta) * radius * this.settings.form.lights.offset;
      const y =
        this.size.y / 2 +
        Math.sin(theta) * radius * this.settings.form.lights.offset;
      this.quantumWave(x, y, radius * 3);
      // this.quantumWave(this.size.x / 2, this.size.y / 2, radius * 3);
    }

    this.frame.toggle(this.frameEnabled);

    if (this.frameEnabled) {
      this.frame.draw();
    }
  }

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
    p0.set(x, y).add(waveFnTmp0.set(-waveLength, -waveLength).multiply(normal));
    // Forward
    p1.set(x, y).add(waveFnTmp1.set(waveLength, waveLength).multiply(normal));

    // Wave start
    p2.set(x, y).add(
      waveFnTmp2
        .set(-waveLength - halfWaveLength, -waveLength - halfWaveLength)
        .multiply(normal),
    );
    // Wave end
    p3.set(x, y).add(
      waveFnTmp3
        .set(waveLength + halfWaveLength, waveLength + halfWaveLength)
        .multiply(normal),
    );

    tangent.set(-normal.y, normal.x);

    // Draw dots for debugging

    if (debug && this.ctx) {
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
        } = this.computeRandomPointInWaveFunction(p2, p3, t, seededRandom());

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
        seededRandom(),
      );

    return {
      waveFunctionProbabilityX,
      waveFunctionProbabilityY,
    };
  }

  samplePhaseFromSinSquared(): number {
    const u = seededRandom(); // uniform [0,1]
    const root = Math.asin(Math.sqrt(u)); // inverse CDF
    const phase = seededRandom() < 0.5 ? root : Math.PI - root; // reflect for symmetry
    return phase;
  }

  sampleTFromWaveFunction(): number {
    const phase = this.samplePhaseFromSinSquared();
    return phase / Math.PI;
  }

  quantumWave(centerX: number, centerY: number, radius: number) {
    if (!this.ctx) return;

    const phase = MathUtils.degToRad(this.settings.form.waves.phase);
    const photonOpacity = this.isExporting
      ? this.settings.form.photon.opacity
      : 1;

    for (let i = 0; i < this.settings.form.lights.rays; i++) {
      const t = i / this.settings.form.lights.rays;

      // TODO: add param for this
      // const phase =
      //   MathUtils.degToRad(this.settings.form.waves.phase) + Math.sqrt(i);

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
          Math.sin(phase + progress * TWO_PI * this.settings.form.waves.count) *
            0.5 +
            0.5,
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
        this.ctx.fillStyle = `rgba(255, 255, 255, ${MathUtils.clamp(waveOpacity * photonOpacity * this.opacityStep, 0, 1)})`;
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
    return this.settings.scale / this.settings.form.photon.density;
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

    const render = target.render.bind(target);

    // Render
    this.folders.render = this.addFolder(this.gui, { title: "Render" });
    this.folders.render
      .addBinding(target.settings, "accumulate")
      .on("change", render);
    this.folders.render
      .addBinding(target.settings, "renderSteps", { min: 1, max: 100, step: 1 })
      .on("change", render);
    this.folders.render.addBinding(target, "renderProgress", {
      min: 0,
      max: 1,
      readonly: true,
    });

    // Form
    this.folders.form = this.addFolder(this.gui, { title: "Form" });
    this.folders.form
      .addBinding(target.settings, "seed", { min: 0, step: 1 })
      .on("change", render);

    this.folders.form
      .addButton({ title: "Increment seed", label: "" })
      .on("click", () => {
        render();
        this.gui.refresh();
      });
    this.folders.form
      .addButton({ title: "Render", label: "" })
      .on("click", render);
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
      .on("change", render);
    this.folders.lights
      .addBinding(target.settings.form.lights, "startAngle", {
        min: 0,
        max: 360,
      })
      .on("change", render);
    this.folders.lights
      .addBinding(target.settings.form.lights, "rays", {
        min: 1,
        max: 1000,
        step: 1,
      })
      .on("change", render);
    this.folders.lights
      .addBinding(target.settings.form.lights, "offset", {
        min: 0,
        max: 2,
      })
      .on("change", render);

    // Waves
    this.folders.waves = this.addFolder(this.gui, { title: "Waves" });
    this.folders.waves
      .addBinding(target.settings.form.waves, "count", {
        min: 1,
        max: 50,
        step: 1,
      })
      .on("change", render);
    this.folders.form
      .addBinding(target.settings.form.waves, "power", { min: 0 })
      .on("change", render);
    this.folders.form
      .addBinding(target.settings.form.waves, "phase", { min: 0 })
      .on("change", render);

    // Photon
    this.folders.photon = this.addFolder(this.gui, { title: "Photon" });
    this.folders.photon
      .addBinding(target.settings.form.photon, "radius", { min: 0, max: 1 })
      .on("change", render);
    this.folders.photon
      .addBinding(target.settings.form.photon, "density", {
        min: 1,
        max: 50,
        step: 1,
      })
      .on("change", render);
    this.folders.photon
      .addBinding(target.settings.form.photon, "opacity", {
        min: 0,
        max: 1,
      })
      .on("change", render);

    this.folders.quantum = this.addFolder(this.gui, { title: "Quantum" });

    this.folders.quantum
      .addBinding(target.settings.form.quantum, "waveFunctionHeight", {
        min: 0,
        max: 20,
      })
      .on("change", render);
    this.folders.quantum
      .addBinding(target.settings.form.quantum, "waveLength", {
        min: 0,
        max: 20,
      })
      .on("change", render);

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
