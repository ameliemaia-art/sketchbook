import paper from "paper";

import { GUIType } from "@utils/gui/gui-types";
import Sketch, {
  GUISketch,
  sketchSettings,
  SketchSettings,
} from "../sketch/sketch";
import { columnBase, ColumnBaseSettings } from "./column-base-geometry";

export const ColumnBaseDefaultSettings: SketchSettings & ColumnBaseSettings = {
  ...sketchSettings,
  darkness: true,
  blueprint: {
    visible: false,
    opacity: 0.5,
    cosmos: true,
  },
  form: {
    visible: true,
    opacity: 1,
    layers: {
      plinth: {
        visible: true,
        height: 0.3, // Relative to column radius - taller plinth
        width: 1.4,  // Relative to column radius - wider square base
        startX: 0.0, // Start at column edge
      },
      lowerTorus: {
        visible: true,
        height: 0.2,
        radius: 0.15, // Larger bulge for main torus
        startX: 0.05,  // Start slightly outward to see the connecting lines
      },
      fillet: {
        visible: true,
        height: 0.05, // Thin separating band
        startX: 0.0,  // Usually flush with column
      },
      middleTorus: {
        visible: false, // Disable for now
        height: 0.15,
        radius: 0.12, // Medium torus
        startX: 0.0,
      },
      upperTorus: {
        visible: false, // Disable for now
        height: 0.12,
        radius: 0.09, // Smaller torus
        startX: 0.0,
      },
      shaftTorus: {
        visible: false, // Disable for now
        height: 0.08,
        radius: 0.06, // Small transition to shaft
        startX: 0.0,
      },
    },
    debug: false,
  },
  grid: {
    visible: true,
    divisions: 25,
    opacity: 0.1,
  },
};

export default class ColumnBase extends Sketch {
  settings = ColumnBaseDefaultSettings;
  
  constructor(
    public root: HTMLElement,
    public canvas: HTMLCanvasElement,
  ) {
    super(root, canvas, "Column Base");
  }

  draw() {
    super.draw();
    if (!this.layers.blueprint || !this.layers.form) return;
    
    const radius = (paper.view.size.width / 2) * this.settings.scale * 0.4; // Smaller for better view
    const center = new paper.Point(
      paper.view.bounds.center.x,
      paper.view.bounds.center.y - radius * 0.2 // Offset up to center the base in view
    );
    
    columnBase(
      this.layers.blueprint,
      this.layers.form,
      center,
      paper.view.size,
      radius,
      this.settings,
    );
  }
}

export class GUIColumnBase extends GUISketch {
  constructor(
    gui: GUIType,
    public target: ColumnBase,
    onChange: () => void = () => {},
  ) {
    super(gui, target, target.name());

    this.createLayerControls(onChange);
    this.createGridControls();
  }

  private createLayerControls(onChange: () => void) {
    // Plinth controls
    const plinthFolder = this.folders.form.addFolder({ title: "Plinth" });
    plinthFolder
      .addBinding(this.target.settings.form.layers.plinth, "visible")
      .on("change", this.onChange(onChange));
    plinthFolder
      .addBinding(this.target.settings.form.layers.plinth, "height", {
        min: 0.1,
        max: 0.8,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    plinthFolder
      .addBinding(this.target.settings.form.layers.plinth, "width", {
        min: 1.0,
        max: 2.0,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    plinthFolder
      .addBinding(this.target.settings.form.layers.plinth, "startX", {
        min: -0.2,
        max: 0.2,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));

    // Lower Torus controls
    const lowerTorusFolder = this.folders.form.addFolder({ title: "Lower Torus" });
    lowerTorusFolder
      .addBinding(this.target.settings.form.layers.lowerTorus, "visible")
      .on("change", this.onChange(onChange));
    lowerTorusFolder
      .addBinding(this.target.settings.form.layers.lowerTorus, "height", {
        min: 0.05,
        max: 0.3,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    lowerTorusFolder
      .addBinding(this.target.settings.form.layers.lowerTorus, "radius", {
        min: 0.02,
        max: 0.3,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    lowerTorusFolder
      .addBinding(this.target.settings.form.layers.lowerTorus, "startX", {
        min: -0.2,
        max: 0.2,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));

    // Fillet controls
    const filletFolder = this.folders.form.addFolder({ title: "Fillet (Separator)" });
    filletFolder
      .addBinding(this.target.settings.form.layers.fillet, "visible")
      .on("change", this.onChange(onChange));
    filletFolder
      .addBinding(this.target.settings.form.layers.fillet, "height", {
        min: 0.02,
        max: 0.1,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    filletFolder
      .addBinding(this.target.settings.form.layers.fillet, "startX", {
        min: -0.1,
        max: 0.1,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));

    // Middle Torus controls
    const middleTorusFolder = this.folders.form.addFolder({ title: "Middle Torus" });
    middleTorusFolder
      .addBinding(this.target.settings.form.layers.middleTorus, "visible")
      .on("change", this.onChange(onChange));
    middleTorusFolder
      .addBinding(this.target.settings.form.layers.middleTorus, "height", {
        min: 0.05,
        max: 0.3,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    middleTorusFolder
      .addBinding(this.target.settings.form.layers.middleTorus, "radius", {
        min: 0.02,
        max: 0.2,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    middleTorusFolder
      .addBinding(this.target.settings.form.layers.middleTorus, "startX", {
        min: -0.2,
        max: 0.2,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));

    // Upper Torus controls
    const upperTorusFolder = this.folders.form.addFolder({ title: "Upper Torus" });
    upperTorusFolder
      .addBinding(this.target.settings.form.layers.upperTorus, "visible")
      .on("change", this.onChange(onChange));
    upperTorusFolder
      .addBinding(this.target.settings.form.layers.upperTorus, "height", {
        min: 0.05,
        max: 0.25,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    upperTorusFolder
      .addBinding(this.target.settings.form.layers.upperTorus, "radius", {
        min: 0.02,
        max: 0.15,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    upperTorusFolder
      .addBinding(this.target.settings.form.layers.upperTorus, "startX", {
        min: -0.2,
        max: 0.2,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));

    // Shaft Torus controls
    const shaftTorusFolder = this.folders.form.addFolder({ title: "Shaft Torus" });
    shaftTorusFolder
      .addBinding(this.target.settings.form.layers.shaftTorus, "visible")
      .on("change", this.onChange(onChange));
    shaftTorusFolder
      .addBinding(this.target.settings.form.layers.shaftTorus, "height", {
        min: 0.03,
        max: 0.2,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    shaftTorusFolder
      .addBinding(this.target.settings.form.layers.shaftTorus, "radius", {
        min: 0.01,
        max: 0.1,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    shaftTorusFolder
      .addBinding(this.target.settings.form.layers.shaftTorus, "startX", {
        min: -0.2,
        max: 0.2,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));

    // Debug controls
    this.folders.form
      .addBinding(this.target.settings.form, "debug")
      .on("change", this.onChange(onChange));
  }

  private createGridControls() {
    this.folders.grid = this.addFolder(this.gui, { title: "Grid", index: 5 });
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

  private onChange(callback: () => void) {
    return () => {
      this.target.draw();
      callback();
    };
  }
}
