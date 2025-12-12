import paper from "paper";
import { FolderApi } from "tweakpane";

import mathSeeded from "@utils/math-seeded";
import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import { hypatia, HypatiaSettings } from "./hypatia-geometry";

export const hypatiaSettings: SketchSettings & HypatiaSettings = {
  ...sketchSettings,
  scale: 0.85,
  seed: 25,
  darkness: true,
  blueprint: {
    visible: true,
    opacity: 0.5,
    cosmos: false,
  },
  form: {
    visible: true,
    opacity: 1,
    outline: true,
    hypatia: {
      visible: true,
      radius: 0.015,
    },
    orbit: {
      visible: true,
      color: 0.5,
    },
    planets: {
      visible: true,
      color: 0.25,
      spiral: 810,
      radius: 0.0075,
    },
    stars: {
      visible: true,
      total: 5000,
      radius: 0.002,
      color: 0.5,
    },
    motion: {
      visible: true,
      dash: 0.005,
      color: 1,
    },
  },
};

export default class Hypatia extends Sketch {
  settings: SketchSettings & HypatiaSettings = hypatiaSettings;

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Hypatia");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    mathSeeded.setSeed(this.settings.seed);
    hypatia(
      this.layers.blueprint,
      this.layers.form,
      center,
      radius,
      this.settings,
    );
  }
}

export class GUIHypatia extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: Hypatia,
  ) {
    super(gui, target, target.name());

    this.folders.form
      .addBinding(target.settings.form, "outline")
      .on("change", this.draw);

    this.folders.hypatia = this.addFolder(this.folders.form, {
      title: "hypatia",
    });
    this.folders.hypatia
      .addBinding(target.settings.form.hypatia, "visible")
      .on("change", this.draw);

    this.folders.orbit = this.addFolder(this.folders.form, {
      title: "orbit",
    });
    this.folders.orbit
      .addBinding(target.settings.form.orbit, "visible")
      .on("change", this.draw);
    this.folders.orbit
      .addBinding(target.settings.form.orbit, "color", {
        min: 0,
        max: 1,
      })
      .on("change", this.draw);

    this.folders.planets = this.addFolder(this.folders.form, {
      title: "planets",
    });
    this.folders.planets
      .addBinding(target.settings.form.planets, "visible")
      .on("change", this.draw);
    this.folders.planets
      .addBinding(target.settings.form.planets, "spiral", {
        min: 0,
      })
      .on("change", this.draw);
    this.folders.planets
      .addBinding(target.settings.form.planets, "radius", {
        min: 0,
        max: 1,
      })
      .on("change", this.draw);

    this.folders.stars = this.addFolder(this.folders.form, { title: "stars" });
    this.folders.stars
      .addBinding(target.settings.form.stars, "visible")
      .on("change", this.draw);
    this.folders.stars
      .addBinding(target.settings.form.stars, "radius", {
        min: 0,
        max: 1,
      })
      .on("change", this.draw);

    this.folders.stars
      .addBinding(target.settings.form.stars, "total", {
        min: 1,
        max: 100000,
        step: 1,
      })
      .on("change", this.draw);

    this.folders.motion = this.addFolder(this.folders.form, {
      title: "motion",
    });
    this.folders.motion
      .addBinding(target.settings.form.motion, "visible")
      .on("change", this.draw);
    this.folders.motion
      .addBinding(target.settings.form.motion, "color", {
        min: 0,
        max: 1,
      })
      .on("change", this.draw);
  }
}
