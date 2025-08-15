import paper from "paper";
import { MathUtils } from "three";

import { createGrid, createLine, dot } from "@utils/paper/utils";
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
  lathe: {
    height: number;
    divisions: number;
    scaleX: number;
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

  const points: paper.Point[] = [];
  for (let i = 0; i < settings.lathe.divisions; i++) {
    const t = i / (settings.lathe.divisions - 1);
    const theta = MathUtils.lerp(-90, 90, t);
    const x =
      radius * settings.lathe.scaleX * Math.cos(MathUtils.degToRad(theta));
    const y = radius + radius * Math.sin(MathUtils.degToRad(theta));
    const point = new paper.Point(x, y);
    dot(point, 1, form, settings.strokeColor);
    points.push(point);
  }

  // Draw line between points
  points.forEach((point, i) => {
    if (i > 0) {
      createLine(
        [points[i - 1], point],
        settings.strokeColor,
        settings.strokeWidth,
        form,
      );
    }
  });

  // points.forEach((point) => {
  //   createLine(
  //     [new paper.Point(0, 10), center],
  //     settings.strokeColor,
  //     settings.strokeWidth,
  //     blueprint,
  //   );
  // });
}
