import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  SketchSettings,
  sketchSettings,
} from "../sketch/sketch";
import { vesciaPiscis, VesicaPiscisSettings } from "./vescia-piscis-geometry";

export default class VesicaPiscis extends Sketch {
  settings: SketchSettings & VesicaPiscisSettings = {
    ...sketchSettings,
    layers: {
      background: false,
      outline: false,
      heaven: true,
      earth: true,
      creation: true,
    },
  };

  draw() {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    this.group?.addChild(vesciaPiscis(center, radius, this.settings));
  }

  name() {
    return "Vesica Piscis";
  }
}

export class GUIVesicaPiscis extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: VesicaPiscis,
  ) {
    super(gui, target, target.name());

    this.folders.layers
      .addBinding(target.settings.layers, "creation")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "heaven")
      .on("change", this.draw);
    this.folders.layers
      .addBinding(target.settings.layers, "earth")
      .on("change", this.draw);
  }
}
