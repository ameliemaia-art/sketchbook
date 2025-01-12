import paper from "paper";
import { FolderApi } from "tweakpane";

import Sketch, {
  GUISketch,
  sketchSettings,
  SketchSettings,
} from "../sketch/sketch";
import { treeOfLife, TreeOfLifeSettings } from "./tree-of-life-geometry";

export default class TreeOfLife extends Sketch {
  settings: SketchSettings & TreeOfLifeSettings = {
    ...sketchSettings,
    layers: {
      darkness: false,
      light: false,
      guide0: false,
      guide1: false,
      guide2: false,
      guide3: false,
      form0: true,
      form1: true,
      form2: true,
      form3: true,
      form4: true,
      form5: true,
      form6: true,
      form7: true,
      form8: true,
      form9: true,
    },
  };

  draw() {
    super.draw();
    const radius = (paper.view.size.width / 2) * this.settings.scale;
    const center = paper.view.bounds.center;
    this.group?.addChild(treeOfLife(center, radius, this.settings));
  }

  name() {
    return "Tree of Life";
  }
}

export class GUITreeOfLife extends GUISketch {
  constructor(
    gui: FolderApi,
    public target: TreeOfLife,
  ) {
    super(gui, target, target.name());

    this.folders.guide = this.addFolder(this.folders.layers, {
      title: "Guides",
    });
    this.folders.form = this.addFolder(this.folders.layers, {
      title: "Form",
    });

    for (let i = 0; i < 4; i++) {
      this.folders.guide
        .addBinding(target.settings.layers, `guide${i}`)
        .on("change", this.draw);
    }
    for (let i = 0; i < 10; i++) {
      this.folders.form
        .addBinding(target.settings.layers, `form${i}`)
        .on("change", this.draw);
    }
  }
}
