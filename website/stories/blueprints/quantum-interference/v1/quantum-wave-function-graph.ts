import { GUIFrame } from "@/stories/frame/frame";
import paper from "paper";
import { seededRandom } from "three/src/math/MathUtils.js";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../../sketch/sketch";
import {
  graph,
  QuantumWaveFunctionGraphSettings,
} from "./quantum-wave-function-graph-geometry";

export default class QuantumWaveFunctionGraph extends Sketch {
  settings: SketchSettings & QuantumWaveFunctionGraphSettings = {
    ...sketchSettings,
    darkness: true,
    seed: 5,
    grid: {
      visible: true,
      divisions: 25,
      opacity: 0.1,
    },
    blueprint: {
      opacity: 1,
      visible: true,
      cosmos: false,
    },
    form: {
      opacity: 1,
      visible: true,
    },
    graph: {
      particles: {
        radius: 0.5,
        count: 2500,
        visible: true,
      },
      curve: {
        visible: true,
        strokeWidth: 0.1,
        strokeColor: 0.25,
      },
      legend: {
        fontSize: 12,
        offset: 10,
      },
      title: {
        fontSize: 14,
      },
      padding: 100,
      lineColor: 0.25,
    },
  };

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Wavefunction Density");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    seededRandom(this.settings.seed);
    graph(
      this.layers.blueprint,
      this.layers.form,
      center,
      paper.view.size,
      radius,
      this.settings,
    );
  }
}

export class GUIQuantumWaveFunctionGraph extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: QuantumWaveFunctionGraph,
  ) {
    super(gui, target, target.name());

    this.addGridControls();
    this.addGraphControls();

    this.controllers.frame = new GUIFrame(this.gui, this.target.frame);
  }

  addGridControls() {
    this.folders.grid = this.addFolder(this.gui, { title: "Grid" });
    this.folders.grid
      .addBinding(this.target.settings.grid, "visible")
      .on("change", this.draw);
    this.folders.grid
      .addBinding(this.target.settings.grid, "opacity", {
        min: 0,
        max: 1,
      })
      .on("change", this.draw);
  }

  addGraphControls() {
    // Graph
    this.folders.graph = this.addFolder(this.gui, { title: "Graph" });

    // Curve
    this.folders.curve = this.addFolder(this.folders.graph, { title: "Curve" });

    this.folders.curve
      .addBinding(this.target.settings.graph.curve, "visible")
      .on("change", this.draw);
    this.folders.curve
      .addBinding(this.target.settings.graph.curve, "strokeWidth", {
        min: 0.1,
        max: 5,
        step: 0.1,
      })
      .on("change", this.draw);
    this.folders.curve
      .addBinding(this.target.settings.graph.curve, "strokeColor", {
        min: 0,
        max: 1,
      })
      .on("change", this.draw);

    // Legend
    this.folders.legend = this.addFolder(this.folders.graph, {
      title: "Legend",
    });
    this.folders.legend
      .addBinding(this.target.settings.graph.legend, "offset", {
        min: 0,
        step: 1,
      })
      .on("change", this.draw);
    this.folders.legend
      .addBinding(this.target.settings.graph.legend, "fontSize", {
        min: 1,
      })
      .on("change", this.draw);

    // Legend
    this.folders.title = this.addFolder(this.folders.graph, {
      title: "Title",
    });
    this.folders.title
      .addBinding(this.target.settings.graph.title, "fontSize", {
        min: 1,
      })
      .on("change", this.draw);

    // Particles
    this.folders.particles = this.addFolder(this.folders.graph, {
      title: "Particles",
    });

    this.folders.particles
      .addBinding(this.target.settings.graph.particles, "visible")
      .on("change", this.draw);
    this.folders.particles
      .addBinding(this.target.settings.graph.particles, "count", {
        min: 100,
        max: 10000,
        step: 1,
      })
      .on("change", this.draw);
    this.folders.particles
      .addBinding(this.target.settings.graph.particles, "radius", {
        min: 0,
        max: 1,
      })
      .on("change", this.draw);
  }
}
