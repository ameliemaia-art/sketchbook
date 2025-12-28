import paper from "paper";
import { MathUtils } from "three";

import { createGrid, createLine, dot } from "@utils/paper/utils";
import { SketchSettings } from "../../sketch/sketch";
import { drawDot, drawLine } from "./utils";

export type QuantumWaveFunctionGraphSettings = {
  grid: {
    visible: boolean;
    opacity: number;
    divisions: number;
  };
  blueprint: {
    curve: boolean;
    curveStrokeWidth: number;
  };
  form: { particles: number };
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
  settings: SketchSettings & QuantumWaveFunctionGraphSettings,
) {
  const gridColor = new paper.Color(1, 1, 1, settings.grid.opacity);

  if (settings.grid.visible) {
    createGrid(
      center,
      size,
      gridColor,
      settings.strokeWidth,
      settings.grid.divisions,
      blueprint,
    );
    createGrid(center, size, gridColor, settings.strokeWidth, 5, blueprint);
  }

  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  const padding = 20 * settings.exportScale;
  const height = size.height - padding;

  // Draw  curve
  const count = 100;
  const points = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const phase = t * Math.PI;
    const x = MathUtils.lerp(padding, size.width - padding, t);
    const y = size.height - padding - curve(phase) * (height - padding);
    points.push(new paper.Point(x, y));
    // dot(new paper.Point(x, y), 1, blueprint, settings.strokeColor);
  }

  if (settings.blueprint.curve) {
    const path = createLine(
      points,
      settings.strokeColor,
      settings.blueprint.curveStrokeWidth,
      form,
    );
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.blueprint.curveStrokeWidth;
    blueprint.addChild(path);
  }

  // Draw particles according to probability density

  const particleColor = new paper.Color(1, 1, 1, 1);

  for (let i = 0; i < settings.form.particles; i++) {
    // 1. Sample phase according to sin² (Born rule)
    const u = Math.random();
    const rootPhase = Math.asin(Math.sqrt(u));
    const phase = Math.random() < 0.5 ? rootPhase : Math.PI - rootPhase;

    // 2. Phase → x
    const t = phase / Math.PI;
    const x = MathUtils.lerp(padding, size.width - padding, t);

    // 3. Evaluate curve at that phase (single-valued)
    const probability = curve(phase);
    const y = size.height - padding - probability * (height - padding);

    // 4. Draw particle
    dot(new paper.Point(x, y), 0.5 * settings.exportScale, form, particleColor);
  }

  return form;
}
