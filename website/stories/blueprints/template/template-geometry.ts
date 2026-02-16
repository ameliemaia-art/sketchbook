import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle } from "../../../utils/paper/utils";
import { BlueprintSettings } from "../blueprint/blueprint";

export type TemplateSettings = {
  blueprint: {};
  form: {};
};

export function template(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  settings: BlueprintSettings & TemplateSettings,
) {
  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  // Line from center
  const total = 6;
  const innerRadius = radius / 3;
  const outlineRadius = radius - innerRadius;
  const startAngle = -Math.PI / 6;

  // Center Circle
  if (settings.form.seed) {
    createCircle(
      center,
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      undefined,
      form,
    );
  }
}
