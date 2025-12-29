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

  const padding = 100 * settings.exportScale;
  const height = size.height - padding;

  const lineColor = new paper.Color(1, 1, 1, 0.25);
  // Graph lines
  createLine(
    [
      new paper.Point(padding, paper.view.size.height - padding),
      new paper.Point(
        paper.view.size.width - padding,
        paper.view.size.height - padding,
      ),
    ],
    lineColor,
    settings.strokeWidth,
    blueprint,
  );
  createLine(
    [
      new paper.Point(padding, padding),
      new paper.Point(padding, paper.view.size.height - padding),
    ],
    lineColor,
    settings.strokeWidth,
    blueprint,
  );

  // Draw labels with paperjs
  const legendFontSize = 10 * settings.exportScale;
  const legendOffset = 10 * settings.exportScale;
  const labelColor = settings.strokeColor;

  // Amplitude labels (vertical, left side)
  const amplitudeLabelCount = 3;
  for (let i = 0; i < amplitudeLabelCount; i++) {
    const labelY = MathUtils.lerp(
      paper.view.size.height - padding,
      padding + legendFontSize,
      i / (amplitudeLabelCount - 1),
    );
    const amplitudeValue = (i / (amplitudeLabelCount - 1)).toFixed(1);

    const label = new paper.PointText({
      point: [padding - legendOffset, labelY],
      content: amplitudeValue,
      fillColor: labelColor,
      fontSize: legendFontSize,
      justification: "right",
    });

    blueprint.addChild(label);
  }

  // Frequency labels (horizontal, bottom side)
  const frequencyLabelCount = 5;
  const frequencyStart = 0;
  const frequencyEnd = 180; // Phase in degrees (0 to π)

  for (let i = 0; i < frequencyLabelCount; i++) {
    const percent = i / (frequencyLabelCount - 1);
    const labelX = MathUtils.lerp(padding, size.width - padding, percent);

    let justification: "left" | "center" | "right" = "center";
    if (i === 0) {
      justification = "left";
    } else if (i === frequencyLabelCount - 1) {
      justification = "right";
    }

    const frequencyValue = Math.round(
      MathUtils.lerp(frequencyStart, frequencyEnd, percent),
    );

    const label = new paper.PointText({
      point: [labelX, paper.view.size.height - padding + legendOffset * 2],
      content: `${frequencyValue}°`,
      fillColor: labelColor,
      fontSize: legendFontSize,
      justification,
    });

    blueprint.addChild(label);
  }

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
    // 1. Uniform x
    const t = Math.random();
    const phase = t * Math.PI;

    // 2. Phase → x
    const x = MathUtils.lerp(padding, size.width - padding, t);

    // 3. Evaluate curve at that phase (single-valued)
    const probability = curve(phase);

    const yNorm = Math.random();
    if (yNorm > probability) continue;

    // 4. Sample vertically under the curve
    const v = Math.random();
    let y = probability * v * (height - padding);

    // const y = size.height - padding - probability * ((height*Math.random()) - padding);
    // flip y to match graph orientation
    y = size.height - y;
    // Add padding offset
    y -= padding;

    // 4. Draw particle
    dot(new paper.Point(x, y), 0.5 * settings.exportScale, form, particleColor);
  }

  return form;
}
