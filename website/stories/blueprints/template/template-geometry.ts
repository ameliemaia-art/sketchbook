import paper from "paper";

import { createCircle, createGrid } from "../../../utils/paper/utils";
import { BlueprintSettings } from "../blueprint/blueprint";

export type TemplateSettings = {
  blueprint: {};
  form: {};
};

export function template(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: BlueprintSettings & TemplateSettings,
) {
  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  const innerRadius = radius / 3;

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
}
