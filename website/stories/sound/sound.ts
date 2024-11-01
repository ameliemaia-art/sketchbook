import paper from "paper";
import { FolderApi } from "tweakpane";

import { saveImage } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import soundAnalyzer, { GUISoundAnalyzer } from "@utils/sound/sound-analyzer";
import Graph from "./graph/graph";

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

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    this.canvas = canvas;

    canvas.width = 1000;
    canvas.height = 600;
    paper.setup(canvas);

    soundAnalyzer
      .loadAndPlayAudio("/assets/sounds/klangkuenstler-untergang.mp3")
      .then(() => {
        console.log("loaded");
      });

    const size = 200;

    this.kickGraph = new Graph(100, 300, size);
    this.snareGraph = new Graph(400, 300, size);
    this.beatGraph = new Graph(700, 300, size);

    this.draw();
    this.update();
  }

  onBeat = () => {};

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

    // const centerX = paper.view.center.x;
    // const centerY = paper.view.center.x;
    // const size = 100;
    // const rect0 = new paper.Path.Rectangle({
    //   x: centerX - size / 2 - size,
    //   y: centerY - size / 2,
    //   width: size,
    //   height: size,
    // });
    // const rect1 = new paper.Path.Rectangle({
    //   x: centerX - size / 2,
    //   y: centerY - size / 2,
    //   width: size,
    //   height: size,
    // });
    // const rect2 = new paper.Path.Rectangle({
    //   x: centerX - size / 2 + size,
    //   y: centerY - size / 2,
    //   width: size,
    //   height: size,
    // });
    // const color0 = soundAnalyzer.beatDetected
    //   ? "rgba(255, 255, 255, 1)"
    //   : "rgba(255, 255, 255, 0.1)";
    // const color1 = soundAnalyzer.kickDetected
    //   ? "rgba(255, 255, 255, 1)"
    //   : "rgba(255, 255, 255, 0.1)";
    // const color2 = soundAnalyzer.snareDetected
    //   ? "rgba(255, 255, 255, 1)"
    //   : "rgba(255, 255, 255, 0.1)";
    // rect0.style.fillColor = new paper.Color(color0);
    // rect1.style.fillColor = new paper.Color(color1);
    // rect2.style.fillColor = new paper.Color(color2);
  };

  draw = () => {
    paper.project.activeLayer.removeChildren();
  };

  saveImage = () => {
    saveImage(this.canvas, "wordmark");
  };

  saveSVG = () => {};
}

export class SoundGUI extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: Wordmark,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Sound" });

    // this.gui.addButton({ title: "Draw" }).on("click", target.draw);
    // this.gui.addButton({ title: "Save Image" }).on("click", target.saveImage);

    this.controllers.soundAnalyzer = new GUISoundAnalyzer(
      this.gui,
      soundAnalyzer,
    );
  }
}
