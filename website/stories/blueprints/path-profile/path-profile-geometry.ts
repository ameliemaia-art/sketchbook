import paper from "paper";
import { MathUtils } from "three";

import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import { generateBindingOptions } from "@utils/editor/gui/gui-utils";
import { createGrid, createLine, dot } from "@utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";
import {
  acanthusPath,
  AcanthusPath,
  GUIAcanthusPath,
} from "./acanthus-geometry";
import { GUIScotiaPath, scotiaPath, ScotiaPath } from "./scotia-geometry";
import { GUITorusPath, torusPath, TorusPath } from "./torus-geometry";

export enum PathProfileProfile {
  Torus = "Torus",
  Scotia = "Scotia",
  AcanthusBase = "AcanthusBase",
  AcanthusMiddle = "AcanthusMiddle",
  AcanthusVoluteCorner = "AcanthusVoluteCorner",
  AcanthusVoluteCenter = "AcanthusVoluteCenter",
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
  pathProfile: string;
  torus: TorusPath;
  scotia: ScotiaPath;
  acanthusBase: AcanthusPath;
  acanthusMiddle: AcanthusPath;
  acanthusTop: AcanthusPath;
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

  switch (settings.pathProfile) {
    case PathProfileProfile.Torus:
      points = torusPath(center, size, radius, settings.torus);
      break;
    case PathProfileProfile.Scotia:
      points = scotiaPath(center, size, radius, settings.scotia);
      break;
    case PathProfileProfile.AcanthusBase:
      points = acanthusPath(center, size, radius, settings.acanthusBase);
      break;
    case PathProfileProfile.AcanthusMiddle:
      points = acanthusPath(center, size, radius, settings.acanthusMiddle);
      break;
    case PathProfileProfile.AcanthusTop:
      points = acanthusPath(center, size, radius, settings.acanthusTop);
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
      .addBinding(target, "pathProfile", {
        options: generateBindingOptions(Object.values(PathProfileProfile)),
      })
      .on("change", this.onChange);

    this.controllers.torus = new GUITorusPath(this.gui, target.torus);
    this.controllers.torus.addEventListener("change", this.onChange);

    this.controllers.scotia = new GUIScotiaPath(this.gui, target.scotia);
    this.controllers.scotia.addEventListener("change", this.onChange);

    this.controllers.acanthusBase = new GUIAcanthusPath(
      this.gui,
      target.acanthusBase,
      "Base",
    );
    this.controllers.acanthusBase.addEventListener("change", this.onChange);

    this.controllers.acanthusMiddle = new GUIAcanthusPath(
      this.gui,
      target.acanthusMiddle,
      "Middle",
    );
    this.controllers.acanthusMiddle.addEventListener("change", this.onChange);

    this.controllers.acanthusTop = new GUIAcanthusPath(
      this.gui,
      target.acanthusTop,
      "Top",
    );
    this.controllers.acanthusTop.addEventListener("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
