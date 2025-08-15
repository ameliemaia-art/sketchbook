import paper from "paper";

import { createGrid } from "@utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

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
};

function setDashLength(path: paper.Path, dash: number) {
  let pathLength = path.length;
  let numDashes = Math.ceil(pathLength / (dash * 2));
  let adjustedDash = pathLength / (numDashes * 2);
  path.dashOffset = adjustedDash;
  path.dashArray = [adjustedDash, adjustedDash];
}

function createLathe(
  radius: number,
  center: paper.Point,
  perspectiveFactorX: number,
  perspectiveFactorY: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  dash: number,
  group: paper.Group,
) {
  const path = new paper.Path.Ellipse({
    center: center,
    size: [radius * 2 * perspectiveFactorX, radius * 2 * perspectiveFactorY], // Making Y-axis shorter
    strokeColor,
    strokeWidth,
  });
  group.addChild(path);
  setDashLength(path, dash);
  return path;
}

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

  // createLathe();
}
