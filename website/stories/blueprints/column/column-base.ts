import paper from "paper";

import { GUIType } from "@utils/gui/gui-types";
import { createGrid } from "@utils/paper/utils";
import Sketch, {
  GUISketch,
  sketchSettings,
  SketchSettings,
} from "../sketch/sketch";
import { columnBase, ColumnBaseSettings } from "./column-base-geometry";

export const ColumnBaseDefaultSettings: SketchSettings & ColumnBaseSettings = {
  ...sketchSettings,
  scale: 1.5,
  darkness: true,
  blueprint: {
    visible: false,
    opacity: 0.5,
    cosmos: true,
  },
  form: {
    visible: true,
    opacity: 1,
    strokeWidth: 2, // Line thickness for all elements
    layers: {
      plinth: {
        visible: true,
        height: 0.3, // Relative to column radius - taller plinth
        width: 1.4, // Relative to column radius - wider square base
        startX: 0.0, // Start at column edge
      },
      lowerTorus: {
        visible: true,
        height: 0.2,
        radius: 0.1, // Larger bulge for main torus
        startX: 0.2, // Start slightly outward to see the connecting lines
      },
      fillet: {
        visible: true,
        height: 0.05, // Thin separating band
        startX: 0.1, // Usually flush with column
      },
      scotia: {
        visible: true,
        height: 0.15, // Concave molding height
        depth: 0.05, // How deep it curves inward
        startX: 0.1, // Start at column edge
      },
      upperFillet: {
        visible: true,
        height: 0.04, // Thin separating band above scotia
        startX: 0.1, // Usually flush with column
      },
      middleTorus: {
        visible: true, // Enable middle torus
        height: 0.12, // Smaller than lower torus
        radius: 0.05, // Medium torus bulge
        startX: 0.1, // Start at column edge
      },
      secondUpperFillet: {
        visible: true,
        height: 0.03, // Thin separating band above middle torus
        startX: 0.1, // Usually flush with column
      },
      cymaReversa: {
        visible: true,
        height: 0.15, // Elegant S-curve molding
        depth: 0.15, // How deep the S-curve extends
        startX: 0.1, // Start at column edge
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
      paper.view.bounds.center.y - radius * 0.2, // Offset up to center the base in view
    );

    const gridColor = new paper.Color(1, 1, 1, this.settings.grid.opacity);

    if (this.settings.grid.visible) {
      createGrid(
        center,
        paper.view.size,
        gridColor,
        this.settings.strokeWidth,
        this.settings.grid.divisions,
        this.layers.form,
      );
      createGrid(
        center,
        paper.view.size,
        gridColor,
        this.settings.strokeWidth,
        5,
        this.layers.form,
      );
    }

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
    const lowerTorusFolder = this.folders.form.addFolder({
      title: "Lower Torus",
    });
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
    const filletFolder = this.folders.form.addFolder({
      title: "Fillet (Separator)",
    });
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

    // Scotia controls
    const scotiaFolder = this.folders.form.addFolder({
      title: "Scotia (Concave)",
    });
    scotiaFolder
      .addBinding(this.target.settings.form.layers.scotia, "visible")
      .on("change", this.onChange(onChange));
    scotiaFolder
      .addBinding(this.target.settings.form.layers.scotia, "height", {
        min: 0.05,
        max: 0.3,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    scotiaFolder
      .addBinding(this.target.settings.form.layers.scotia, "depth", {
        min: 0.02,
        max: 0.2,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    scotiaFolder
      .addBinding(this.target.settings.form.layers.scotia, "startX", {
        min: -0.2,
        max: 0.2,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));

    // Upper Fillet controls
    const upperFilletFolder = this.folders.form.addFolder({
      title: "Upper Fillet",
    });
    upperFilletFolder
      .addBinding(this.target.settings.form.layers.upperFillet, "visible")
      .on("change", this.onChange(onChange));
    upperFilletFolder
      .addBinding(this.target.settings.form.layers.upperFillet, "height", {
        min: 0.02,
        max: 0.1,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    upperFilletFolder
      .addBinding(this.target.settings.form.layers.upperFillet, "startX", {
        min: -0.1,
        max: 0.1,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));

    // Middle Torus controls
    const middleTorusFolder = this.folders.form.addFolder({
      title: "Middle Torus",
    });
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

    // Second Upper Fillet controls
    const secondUpperFilletFolder = this.folders.form.addFolder({
      title: "Second Upper Fillet",
    });
    secondUpperFilletFolder
      .addBinding(this.target.settings.form.layers.secondUpperFillet, "visible")
      .on("change", this.onChange(onChange));
    secondUpperFilletFolder
      .addBinding(
        this.target.settings.form.layers.secondUpperFillet,
        "height",
        {
          min: 0.02,
          max: 0.08,
          step: 0.01,
        },
      )
      .on("change", this.onChange(onChange));
    secondUpperFilletFolder
      .addBinding(
        this.target.settings.form.layers.secondUpperFillet,
        "startX",
        {
          min: -0.1,
          max: 0.1,
          step: 0.01,
        },
      )
      .on("change", this.onChange(onChange));

    // Cyma Reversa controls
    const cymaReversaFolder = this.folders.form.addFolder({
      title: "Cyma Reversa (S-curve)",
    });
    cymaReversaFolder
      .addBinding(this.target.settings.form.layers.cymaReversa, "visible")
      .on("change", this.onChange(onChange));
    cymaReversaFolder
      .addBinding(this.target.settings.form.layers.cymaReversa, "height", {
        min: 0.08,
        max: 0.25,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    cymaReversaFolder
      .addBinding(this.target.settings.form.layers.cymaReversa, "depth", {
        min: 0.02,
        max: 0.15,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));
    cymaReversaFolder
      .addBinding(this.target.settings.form.layers.cymaReversa, "startX", {
        min: -0.1,
        max: 0.1,
        step: 0.01,
      })
      .on("change", this.onChange(onChange));

    // Debug controls
    this.folders.form
      .addBinding(this.target.settings.form, "debug")
      .on("change", this.onChange(onChange));

    // Stroke width control
    this.folders.form
      .addBinding(this.target.settings.form, "strokeWidth", {
        min: 0.5,
        max: 5,
        step: 0.1,
      })
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
