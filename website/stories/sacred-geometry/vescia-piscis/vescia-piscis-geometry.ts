import paper from "paper";

import { createCircle } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type VesicaPiscisSettings = {
  layers: {
    creation: boolean;
    heaven: boolean;
    earth: boolean;
  };
};

export function vesciaPiscis(
  center: paper.Point,
  radius: number,
  settings: SketchSettings & VesicaPiscisSettings,
) {
  const group = new paper.Group();
  const innerRadius = radius * (2 / 3);

  if (settings.layers.outline) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    group.addChild(path);
  }

  if (settings.layers.creation) {
    createCircle(
      new paper.Point(center.x, center.y),
      radius / 3,
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.heaven) {
    createCircle(
      new paper.Point(center.x, center.y - innerRadius / 2),
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.earth) {
    createCircle(
      new paper.Point(center.x, center.y + innerRadius / 2),
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  return group;
}
