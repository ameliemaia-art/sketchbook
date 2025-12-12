import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import acanthusBaseSettings from "./data/acanthus-base-settings.json";
import acanthusMiddleSettings from "./data/acanthus-middle-settings.json";
import acanthusVoluteCenterSettings from "./data/acanthus-volute-center-settings.json";
import acanthusVoluteCornerSettings from "./data/acanthus-volute-corner-settings.json";
import voluteSettings from "./data/volute-settings.json";
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
  // Path Profile to render
  pathProfile: PathProfileProfile.Abacus,
  // Paths
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
  acanthusBase: {
    spiralTurns: 1,
    spiralDivisions: 20,
    smoothness: 100,
    cp0: { x: 0.2, y: 1 },
    cp1: { x: 0.15, y: 0.8 },
    cp2: { x: 0.17, y: 0.53 },
    cp3: { x: 0.32, y: 0.31 },
    cp4: { x: 0.58, y: 0.4 },
  },
  acanthusMiddle: {
    spiralTurns: 1,
    spiralDivisions: 20,
    smoothness: 100,
    cp0: { x: 0.2, y: 1 },
    cp1: { x: 0.15, y: 0.8 },
    cp2: { x: 0.17, y: 0.53 },
    cp3: { x: 0.32, y: 0.31 },
    cp4: { x: 0.58, y: 0.4 },
  },
  acanthusVoluteCorner: {
    spiralTurns: 1,
    spiralDivisions: 20,
    smoothness: 100,
    cp0: { x: 0.2, y: 1 },
    cp1: { x: 0.15, y: 0.8 },
    cp2: { x: 0.17, y: 0.53 },
    cp3: { x: 0.32, y: 0.31 },
    cp4: { x: 0.58, y: 0.4 },
  },
  acanthusVoluteCenter: {
    spiralTurns: 1,
    spiralDivisions: 20,
    smoothness: 100,
    cp0: { x: 0.2, y: 1 },
    cp1: { x: 0.15, y: 0.8 },
    cp2: { x: 0.17, y: 0.53 },
    cp3: { x: 0.32, y: 0.31 },
    cp4: { x: 0.58, y: 0.4 },
  },
  volute: {
    spiralTurns: 3,
    spiralDivisions: 20,
    smoothness: 200,
    cp0: { x: 0.2, y: 1 },
    cp1: { x: 0.15, y: 0.8 },
    cp2: { x: 0.17, y: 0.53 },
    cp3: { x: 0.32, y: 0.31 },
    cp4: { x: 0.58, y: 0.4 },
  },
  abacus: {
    radius: 0.45,
    cornerAngleOffset: 2.5,
    subdivisions: 25,
    curveOffset: 0.1,
  },
};

export default class PathProfile extends Sketch {
  settings: SketchSettings & PathProfileSettings = pathProfileSettings;

  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "PathProfile");

    Object.assign(this.settings.acanthusBase, acanthusBaseSettings);
    Object.assign(this.settings.acanthusMiddle, acanthusMiddleSettings);
    Object.assign(
      this.settings.acanthusVoluteCenter,
      acanthusVoluteCenterSettings,
    );
    Object.assign(
      this.settings.acanthusVoluteCorner,
      acanthusVoluteCornerSettings,
    );
    Object.assign(this.settings.volute, voluteSettings);
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
