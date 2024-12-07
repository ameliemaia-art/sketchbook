import paper from "paper";

import { createCircle } from "../utils";

export function vesciaPiscis(
  center: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  universe = false,
  creation = true,
  heaven = true,
  earth = true,
) {
  const group = new paper.Group();

  if (universe) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = strokeColor;
    path.strokeWidth = strokeWidth;
    group.addChild(path);
  }

  const innerRadius = radius * (2 / 3);

  if (creation) {
    createCircle(
      new paper.Point(center.x, center.y),
      radius / 3,
      strokeColor,
      strokeWidth,
      group,
    );
  }

  if (heaven) {
    createCircle(
      new paper.Point(center.x, center.y - innerRadius / 2),
      innerRadius,
      strokeColor,
      strokeWidth,
      group,
    );
  }

  if (earth) {
    createCircle(
      new paper.Point(center.x, center.y + innerRadius / 2),
      innerRadius,
      strokeColor,
      strokeWidth,
      group,
    );
  }

  return group;
}
