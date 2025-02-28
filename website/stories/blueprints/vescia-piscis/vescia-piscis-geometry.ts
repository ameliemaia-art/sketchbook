import paper from "paper";

import { createCircle } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type VesicaPiscisSettings = {
  blueprint: {};
  form: {
    divinity: boolean;
    conscious: boolean;
    unconscious: boolean;
    awakening: boolean;
  };
};

export function vesciaPiscis(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  settings: SketchSettings & VesicaPiscisSettings,
) {
  const innerRadius = radius * (2 / 3);

  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  if (settings.form.divinity) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    form.addChild(path);
  }

  if (settings.form.awakening) {
    createCircle(
      new paper.Point(center.x, center.y),
      radius / 3,
      settings.strokeColor,
      settings.strokeWidth,
      undefined,
      form,
    );
  }

  if (settings.form.conscious) {
    createCircle(
      new paper.Point(center.x, center.y - innerRadius / 2),
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      undefined,
      form,
    );
  }

  if (settings.form.unconscious) {
    createCircle(
      new paper.Point(center.x, center.y + innerRadius / 2),
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      undefined,
      form,
    );
  }
}
