import paper from "paper";
import { FolderApi } from "tweakpane";

import { saveImage } from "@utils/common/file";
import GUIController from "@utils/editor/gui/gui";
import soundAnalyzer, { GUISoundAnalyzer } from "@utils/sound/sound-analyzer";
import Graph from "./graph/graph";
import Visualizer from "./visualizer/brightness-visualizer";
import BrightnessVisualizer from "./visualizer/brightness-visualizer";
import EnergyVisualizer from "./visualizer/energy-visualizer";

export default class Wordmark {
  settings = {
    text: {
      size: 0.0735,
      color: "#ffffff", // eb0000
      letterSpacing: 0.004325,
    },
    debug: {
      width: 1,
      color: "#ffffff",
      enabled: false,
    },
  };

  kickGraph: Graph;
  snareGraph: Graph;
  beatGraph: Graph;
  kickBightnessVisualizer: BrightnessVisualizer;
  snareBightnessVisualizer: BrightnessVisualizer;
  beatBrightnessVisualizer: BrightnessVisualizer;
  kickEnergyVisualizer: EnergyVisualizer;
  snareEnergyVisualizer: EnergyVisualizer;
  beatEnergyVisualizer: EnergyVisualizer;

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    this.canvas = canvas;

    canvas.width = 1000;
    canvas.height = 600;
    paper.setup(canvas);

    const size = 200;

    this.kickGraph = new Graph(100, 300, size);
    this.snareGraph = new Graph(400, 300, size);
    this.beatGraph = new Graph(700, 300, size);

    this.kickBightnessVisualizer = new BrightnessVisualizer(100, 100, 100);
    this.snareBightnessVisualizer = new BrightnessVisualizer(400, 100, 100);
    this.beatBrightnessVisualizer = new BrightnessVisualizer(700, 100, 100);

    this.kickEnergyVisualizer = new EnergyVisualizer(200, 100, 100);
    this.snareEnergyVisualizer = new EnergyVisualizer(500, 100, 100);
    this.beatEnergyVisualizer = new EnergyVisualizer(800, 100, 100);

    this.update();
  }

  update = () => {
    requestAnimationFrame(this.update);
    soundAnalyzer.update();

    paper.project.activeLayer.removeChildren();

    this.kickGraph.settings.threshold = soundAnalyzer.kickModel.threshold;
    this.kickGraph.settings.frequencyStart = soundAnalyzer.kickModel.range.min;
    this.kickGraph.settings.frequencyEnd = soundAnalyzer.kickModel.range.max;
    this.kickGraph.draw(soundAnalyzer.kickModel.fftSlice!);

    this.snareGraph.settings.threshold = soundAnalyzer.snareModel.threshold;
    this.snareGraph.settings.frequencyStart =
      soundAnalyzer.snareModel.range.min;
    this.snareGraph.settings.frequencyEnd = soundAnalyzer.snareModel.range.max;
    this.snareGraph.draw(soundAnalyzer.snareModel.fftSlice!);

    this.beatGraph.settings.threshold = soundAnalyzer.beatModel.threshold;
    this.beatGraph.settings.frequencyStart = soundAnalyzer.beatModel.range.min;
    this.beatGraph.settings.frequencyEnd = soundAnalyzer.beatModel.range.max;
    this.beatGraph.draw(soundAnalyzer.beatModel.fftSlice!);

    this.kickBightnessVisualizer.draw(soundAnalyzer.kickModel.detected);
    this.kickEnergyVisualizer.draw(soundAnalyzer.kickModel.detected);
    this.snareBightnessVisualizer.draw(soundAnalyzer.snareModel.detected);
    this.snareEnergyVisualizer.draw(soundAnalyzer.snareModel.detected);
    this.beatBrightnessVisualizer.draw(soundAnalyzer.beatModel.detected);
    this.beatEnergyVisualizer.draw(soundAnalyzer.beatModel.detected);
  };

  saveImage = () => {
    saveImage(this.canvas, "wordmark");
  };

  saveSVG = () => {};
}

export class SoundGUI extends GUIController {
  constructor(
    gui: FolderApi,
    public target: Wordmark,
  ) {
    super(gui);

    // this.gui.addButton({ title: "Draw" }).on("click", target.draw);
    // this.gui.addButton({ title: "Save Image" }).on("click", target.saveImage);

    this.controllers.soundAnalyzer = new GUISoundAnalyzer(gui, soundAnalyzer);
  }
}
