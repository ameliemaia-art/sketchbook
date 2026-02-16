import paper from "paper";
import { MathUtils } from "three";

import { GOLDEN_RATIO } from "@utils/three/math";
import {
  createCircle,
  createGrid,
  createLine,
  dot,
  lerp,
} from "../../../utils/paper/utils";
import { BlueprintSettings } from "../blueprint/blueprint";

export type AscensionSettings = {
  blueprint: {};
  form: {
    crossHeight: number;
    crossLength: number;
    time: number;
    life: number;
    years: number;
  };
};

function createCross(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: BlueprintSettings & AscensionSettings,
) {
  const color = new paper.Color(1, 1, 1, 1);

  // Vertical
  const crossHeight = (size.height / 2) * settings.form.crossHeight;
  const offset = crossHeight * (2 / GOLDEN_RATIO - 1);
  const v0 = new paper.Point(center.x, center.y - crossHeight + offset);
  const v1 = new paper.Point(center.x, center.y + crossHeight + offset);
  createLine([v0, v1], color, settings.strokeWidth, form);

  // Horizontal
  const crossLength = crossHeight / GOLDEN_RATIO;
  const h0 = new paper.Point(center.x - crossLength, center.y);
  const h1 = new paper.Point(center.x + crossLength, center.y);
  createLine([h0, h1], color, settings.strokeWidth, form);
}

export function ascension(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: BlueprintSettings & AscensionSettings,
) {
  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  const innerRadius = radius / 3;

  // Center Circle
  if (settings.form.cosmos) {
    createCircle(
      center,
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      undefined,
      form,
    );
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

  // Path

  const axis = new paper.Point(center.x, center.y);
  // dot(axis, 5, blueprint);

  const theta = MathUtils.degToRad(settings.form.time);
  const path = settings.form.life * radius;
  const start = new paper.Point(
    axis.x + Math.cos(theta - Math.PI) * path,
    axis.y + Math.sin(theta - Math.PI) * path,
  );
  const end = new paper.Point(
    axis.x + Math.cos(theta) * path,
    axis.y + Math.sin(theta) * path,
  );

  const line = createLine(
    [start, end],
    settings.strokeColor,
    settings.strokeWidth,
    form,
  );
  const lineLength = start.getDistance(end);
  const dashLength = lineLength / (80 * 2); // dpi
  line.dashArray = [dashLength, dashLength];

  const p = lerp(start, end, 0.5);
  createCross(blueprint, form, p, size, radius, settings);
}
