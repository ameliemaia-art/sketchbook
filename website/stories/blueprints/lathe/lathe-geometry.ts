import paper from "paper";
import { MathUtils } from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import { generateBindingOptions } from "@utils/gui/gui-utils";
import { createGrid, createLine, dot } from "@utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";
import { GUIScotia, Scotia, scotia } from "./scotia-geometry";
import { GUITorus, torus, Torus } from "./torus-geometry";

export enum LatheProfile {
  Torus = "Torus",
  Scotia = "Scotia",
}

export type LatheSettings = {
  blueprint: {};
  grid: {
    visible: boolean;
    opacity: number;
    divisions: number;
  };
  form: {
    visible: boolean;
    opacity: number;
    outline: boolean;
  };
  lathe: {
    profile: string;
  };
  torus: Torus;
  scotia: Scotia;
};

export function lathe(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: SketchSettings & LatheSettings,
) {
  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  const gridColor = new paper.Color(1, 1, 1, settings.grid.opacity);

  if (settings.grid.visible) {
    createGrid(
      center,
      size,
      gridColor,
      settings.strokeWidth,
      settings.grid.divisions,
      form,
    );
    createGrid(center, size, gridColor, settings.strokeWidth, 5, form);
  }

  let points: paper.Point[] = [];

  switch (settings.lathe.profile) {
    case LatheProfile.Torus:
      points = torus(radius, settings.torus);
      break;
    case LatheProfile.Scotia:
      points = scotia(radius, settings.scotia);
      break;
    default:
      break;
  }

  points.forEach((point, i) => {
    if (i > 0) {
      createLine(
        [points[i - 1], point],
        settings.strokeColor,
        settings.strokeWidth,
        form,
      );
      dot(point, 2.5, form);
    }
  });
}

/// #if DEBUG
export class GUILatheGeometry extends GUIController {
  constructor(
    gui: GUIType,
    public target: LatheSettings,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "lathe" });

    this.gui
      .addBinding(target.lathe, "profile", {
        options: generateBindingOptions(Object.values(LatheProfile)),
      })
      .on("change", this.onChange);

    this.controllers.torus = new GUITorus(this.gui, target.torus);
    this.controllers.torus.addEventListener("change", this.onChange);

    this.controllers.scotia = new GUIScotia(this.gui, target.scotia);
    this.controllers.scotia.addEventListener("change", this.onChange);
  }

  onChange = () => {
    console.log("xx");

    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
