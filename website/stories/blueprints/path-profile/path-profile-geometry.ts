import paper from "paper";
import { MathUtils } from "three";

import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import { generateBindingOptions } from "@utils/editor/gui/gui-utils";
import { createGrid, createLine, dot } from "@utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";
import { acanthus, Acanthus, GUIAcanthus } from "./acanthus-geometry";
import { GUIScotia, Scotia, scotia } from "./scotia-geometry";
import { GUITorus, torus, Torus } from "./torus-geometry";

export enum PathProfileProfile {
  Torus = "Torus",
  Scotia = "Scotia",
  Acanthus = "Acanthus",
}

export type PathProfileSettings = {
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
  pathProfile: {
    profile: string;
  };
  torus: Torus;
  scotia: Scotia;
  acanthus: Acanthus;
};

export function pathProfile(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: SketchSettings & PathProfileSettings,
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

  switch (settings.pathProfile.profile) {
    case PathProfileProfile.Torus:
      points = torus(center, size, radius, settings.torus);
      break;
    case PathProfileProfile.Scotia:
      points = scotia(center, size, radius, settings.scotia);
      break;
    case PathProfileProfile.Acanthus:
      points = acanthus(center, size, radius, settings.acanthus);
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
export class GUIPathProfileGeometry extends GUIController {
  constructor(
    gui: GUIType,
    public target: PathProfileSettings,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Path Profile Geometry" });

    this.gui
      .addBinding(target.pathProfile, "profile", {
        options: generateBindingOptions(Object.values(PathProfileProfile)),
      })
      .on("change", this.onChange);

    this.controllers.torus = new GUITorus(this.gui, target.torus);
    this.controllers.torus.addEventListener("change", this.onChange);

    this.controllers.scotia = new GUIScotia(this.gui, target.scotia);
    this.controllers.scotia.addEventListener("change", this.onChange);

    this.controllers.acanthus = new GUIAcanthus(this.gui, target.acanthus);
    this.controllers.acanthus.addEventListener("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
