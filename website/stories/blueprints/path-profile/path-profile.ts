import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import acanthusSettings from "./data/acanthus-settings.json";
import {
  GUIPathProfileGeometry,
  pathProfile,
  PathProfileProfile,
  PathProfileSettings,
} from "./path-profile-geometry";

export const pathProfileSettings: SketchSettings & PathProfileSettings = {
  ...sketchSettings,
  scale: 1,
  darkness: true,
  grid: {
    visible: true,
    divisions: 25,
    opacity: 0.1,
  },
  blueprint: {
    visible: true,
    opacity: 0.5,
    cosmos: false,
  },
  form: {
    visible: true,
    opacity: 1,
    outline: true,
  },
  pathProfile: {
    profile: PathProfileProfile.AcanthusFront,
  },
  torus: {
    divisions: 25,
    scaleX: 1,
  },
  scotia: {
    divisions: 25,
    bottomLength: 0.8,
    topLength: 0.1,
    bottomHeight: 0.1,
    topHeight: 0.1,
  },
  acanthusSide: {
    spiralTurns: 1,
    spiralDivisions: 20,
    smoothness: 100,
    cp0: { x: 0.2, y: 1 },
    cp1: { x: 0.15, y: 0.8 },
    cp2: { x: 0.17, y: 0.53 },
    cp3: { x: 0.32, y: 0.31 },
    cp4: { x: 0.58, y: 0.4 },
  },
  acanthusFront: {
    width: 0.7,
    height: 1,
    arcStart: 0.25,
    divisions: 25,
  },
};

export default class PathProfile extends Sketch {
  settings: SketchSettings & PathProfileSettings = pathProfileSettings;

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "PathProfile");

    Object.assign(this.settings.acanthusSide, acanthusSettings);
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    pathProfile(
      this.layers.blueprint,
      this.layers.form,
      center,
      paper.view.size,
      radius,
      this.settings,
    );
  }
}

export class GUIPathProfile extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: PathProfile,
  ) {
    super(gui, target, target.name());

    this.folders.form
      .addBinding(target.settings.form, "outline")
      .on("change", this.draw);

    this.folders.grid = this.addFolder(this.gui, { title: "Grid", index: 5 });
    this.folders.grid
      .addBinding(target.settings.grid, "visible")
      .on("change", this.draw);
    this.folders.grid
      .addBinding(target.settings.grid, "opacity", {
        min: 0,
        max: 1,
      })
      .on("change", this.draw);

    this.controllers.pathProfile = new GUIPathProfileGeometry(
      this.gui,
      target.settings,
    );
    this.controllers.pathProfile.addEventListener("change", this.draw);
  }
}
