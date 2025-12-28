import paper from "paper";
import { MathUtils } from "three";

import { createGrid, dot } from "@utils/paper/utils";
import { SketchSettings } from "../../sketch/sketch";
import { drawDot } from "./utils";

export type GraphSettings = {
  strokeDepthColor: paper.Color;
  grid: {
    visible: boolean;
    opacity: number;
    divisions: number;
  };
  blueprint: {
    architecture: boolean;
  };
  form: {};
};

function curve(phase: number) {
  return Math.pow(Math.sin(phase), 2);
}

export function graph(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: SketchSettings & GraphSettings,
) {
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

  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  // Draw  curve

  const count = 100;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const phase = t * Math.PI;
    const x = MathUtils.lerp(0, size.width, t);
    const y = size.height - curve(phase) * size.height;
    dot(new paper.Point(x, y), 1, blueprint, settings.strokeColor);
  }

  const particleCount = 500;
  const particleColor = new paper.Color(1, 1, 1, 1);

  for (let i = 0; i < particleCount; i++) {
    // 1. Sample phase according to sin² (Born rule)
    const u = Math.random();
    const rootPhase = Math.asin(Math.sqrt(u));
    const phase = Math.random() < 0.5 ? rootPhase : Math.PI - rootPhase;

    // 2. Phase → x
    const t = phase / Math.PI;
    const x = MathUtils.lerp(0, size.width, t);

    // 3. Evaluate curve at that phase (single-valued)
    const probability = curve(phase);
    const y = size.height - probability * size.height;

    // 4. Draw particle
    dot(new paper.Point(x, y), 1, blueprint, particleColor);
  }

  return form;
}
