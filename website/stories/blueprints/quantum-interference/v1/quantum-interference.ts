import Frame, { GUIFrame } from "@/stories/frame/frame";
import { Box2, Clock, MathUtils, Vector2 } from "three";
import { FolderApi } from "tweakpane";

import { saveImage } from "@utils/common/file";
import GUIController from "@utils/editor/gui/gui";
import { TWO_PI } from "@utils/three/math";
import {
  QuantumInterferenceSettings,
  quantumWaveCanvas,
} from "./quantum-interference-geometry";
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
  settings: QuantumInterferenceSettings = {
    blueprint: {
      darkness: true,
    },
    form: {
      emitters: 2,
      waves: 10,
      jitter: 5,
      jitterEnabled: false,
      power: 2,
      phaseDelta: 0.01,
      photonRadius: 0.5,
      particleDensity: 2,
      waveFunctionHeight: 3,
    },
  };

  ctx: CanvasRenderingContext2D | null;
  clock = new Clock();

  dpi = window.devicePixelRatio || 1;

  size: Vector2; // canvas size

  phase = 0;

  frameEnabled = false;
  frame: Frame;

  title = "Quantum Interference";

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    this.ctx = this.canvas.getContext("2d");

    this.frame = new Frame(root, this.canvas, this.title);
    this.size = new Vector2(this.canvas.width, this.canvas.height);

    this.setup();
  }

  async setup(exporting = false) {
    const exportScale = this.frameEnabled ? 3 : 5;
    await this.frame.setup(exporting);
    return new Promise<void>((resolve) => {
      const scale = exporting ? exportScale : 1;
      // this.settings.strokeWidth = 1 * scale;

      const width = 500;
      const height = 500;
      this.canvas.width = width * this.dpi;
      this.canvas.height = height * this.dpi;
      this.canvas.style.width = width + "px";
      this.canvas.style.height = height + "px";
      this.size = new Vector2(width, height); // Update size to logical dimensions
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
    // Circle
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.size.x, this.size.y);

    this.phase -= TWO_PI * this.settings.form.phaseDelta;

    const radius = this.size.x / 2;
    for (let i = 0; i < this.settings.form.emitters; i++) {
      const theta = i * (TWO_PI / this.settings.form.emitters);
      const x = this.size.x / 2 + Math.cos(theta) * radius;
      const y = this.size.y / 2 + Math.sin(theta) * radius;
      this.quantumWave(x, y, radius * 3, theta);
      // this.quantumWave(this.size.x / 2, this.size.y / 2, radius * 3, theta);
    }

    this.frame.toggle(this.frameEnabled);

    if (this.frameEnabled) {
      this.frame.draw();
    }
  };

  computeRandomPointInWaveFunction(t: number, probability: number) {
    const pointAlongWaveX = MathUtils.lerp(p2.x, p3.x, t);
    const pointAlongWaveY = MathUtils.lerp(p2.y, p3.y, t);
    // drawDot(this.ctx, pointAlongWaveX, pointAlongWaveY, 2, "#ffffff");

    const waveHeight =
      Math.sin(Math.PI * t) * this.settings.form.waveFunctionHeight;

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
    // if (!this.ctx) return;
    // calculate the wave function curve for probability

    // Calculate edges of dots

    // Calulate the curve
    // Draw lines for the curve
    // The offset of the particle position could be lerped from the
    // current line position to a sign of the wave curve on either side
    const waveLength = 10;
    // const waveHeight = 10;
    const dotRadius = 10;
    p0.set(x, y).add(new Vector2(-waveLength, -waveLength).multiply(normal));
    p1.set(x, y).add(new Vector2(waveLength, waveLength).multiply(normal));

    p2.set(x, y).add(
      new Vector2(-waveLength - dotRadius, -waveLength - dotRadius).multiply(
        normal,
      ),
    );
    p3.set(x, y).add(
      new Vector2(waveLength + dotRadius, waveLength + dotRadius).multiply(
        normal,
      ),
    );

    tangent.set(-normal.y, normal.x);

    // const t0x = x + tangent.x * -waveHeight;
    // const t0y = y + tangent.y * -waveHeight;
    // const t1x = x + tangent.x * waveHeight;
    // const t1y = y + tangent.y * waveHeight;

    // drawLine(this.ctx, t0x, t0y, t1x, t1y);

    // Draw steps along wave function distance

    // Draw dots for debugging

    // if (debug) {
    //   const steps = 10;
    //   for (let i = 0; i < steps; i++) {
    //     const t = i / (steps - 1);

    //     const {
    //       x: x0,
    //       y: y0,
    //       t0x,
    //       t0y,
    //       t1x,
    //       t1y,
    //     } = this.computeRandomPointInWaveFunction(t, Math.random());

    //     drawDot(this.ctx, x0, y0, 2, "#ff0000");

    //     drawLine(this.ctx, t0x, t0y, t1x, t1y);
    //   }

    //   // drawDot(this.ctx, p0.x, p0.y, dotRadius, "#ffff00");
    //   // drawDot(this.ctx, p1.x, p1.y, dotRadius, "#00ffff");
    //   // drawDot(this.ctx, p2.x, p2.y, 5, "#ffffff");
    //   // drawDot(this.ctx, p3.x, p3.y, 5, "#ffffff");
    // }

    const { x: waveFunctionProbabilityX, y: waveFunctionProbabilityY } =
      this.computeRandomPointInWaveFunction(Math.random(), Math.random());

    return {
      waveFunctionProbabilityX,
      waveFunctionProbabilityY,
    };
  }

  quantumWave(
    centerX: number,
    centerY: number,
    radius: number,
    phaseOffset: number,
  ) {
    if (!this.ctx) return;

    // todo
    const linesPerWave = 100;
    // const steps = 300;
    for (let i = 0; i < linesPerWave; i++) {
      const t = i / linesPerWave;

      // arc
      const theta = t * TWO_PI;
      const dx = centerX + Math.cos(theta) * radius;
      const dy = centerY + Math.sin(theta) * radius;

      // line length / px
      const length = tmp0.set(centerX, centerY).distanceTo(tmp1.set(dx, dy));
      const steps = Math.floor(length) / this.settings.form.particleDensity;

      for (let j = 0; j < steps; j++) {
        const progress = j / steps;
        const x = MathUtils.lerp(centerX, dx, progress);
        const y = MathUtils.lerp(centerY, dy, progress);

        // photon wave from origin
        const waveOpacity = Math.pow(
          Math.sin(this.phase + progress * TWO_PI * this.settings.form.waves) *
            0.5 +
            0.5,
          this.settings.form.power,
        );
        const waveSpectrum = Math.cos(theta * TWO_PI + this.phase) * 0.5 + 0.5;

        // wave function + probability
        // const jitterX = MathUtils.randFloatSpread(
        //   this.settings.form.jitterEnabled ? this.settings.form.jitter : 0,
        // );
        // const jitterY = MathUtils.randFloatSpread(
        //   this.settings.form.jitterEnabled ? this.settings.form.jitter : 0,
        // );

        normal.set(dx - x, dy - y).normalize();

        const { waveFunctionProbabilityX, waveFunctionProbabilityY } =
          this.waveFunction(x, y, normal, j === 0);

        this.ctx.beginPath();
        this.ctx.arc(
          waveFunctionProbabilityX,
          waveFunctionProbabilityY,
          this.settings.form.photonRadius,
          0,
          Math.PI * 2,
        );
        // this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * (waveOpacity + Math.cos(theta * TWO_PI + this.phase) * 0.5 + 0.5)})`;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${waveOpacity})`;
        // this.ctx.fillStyle = `rgba(255, 255, 255, ${waveOpacity})`;
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
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
    this.folders.form
      .addBinding(target.settings.form, "photonRadius", { min: 0, max: 1 })
      .on("change", target.draw);
    this.folders.form
      .addBinding(target.settings.form, "particleDensity", {
        min: 1,
        max: 50,
        step: 1,
      })
      .on("change", target.draw);
    this.folders.form
      .addBinding(target.settings.form, "waveFunctionHeight", {
        min: 0,
        max: 20,
      })
      .on("change", target.draw);

    this.gui
      .addBinding(target, "frameEnabled", { label: "frame" })
      .on("change", target.draw);

    this.gui.addButton({ title: "Save Image", label: "" }).on("click", () => {
      target.saveImage();
    });

    this.controllers.frame = new GUIFrame(this.gui, target.frame);
  }
}
