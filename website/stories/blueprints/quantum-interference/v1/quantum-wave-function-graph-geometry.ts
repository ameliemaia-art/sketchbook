import paper from "paper";
import { MathUtils } from "three";

import mathSeeded from "@utils/math-seeded";
import { createGrid, createLine, dot } from "@utils/paper/utils";
import { SketchSettings } from "../../sketch/sketch";
import { drawDot, drawLine } from "./utils";

export type QuantumWaveFunctionGraphSettings = {
  grid: {
    visible: boolean;
    opacity: number;
    divisions: number;
  };
  blueprint: {};
  graph: {
    particles: {
      count: number;
      visible: boolean;
      radius: number;
    };
    curve: {
      visible: boolean;
      strokeColor: number;
      strokeWidth: number;
    };
    legend: {
      fontSize: number;
      offset: number;
    };
    title: {
      fontSize: number;
    };
    padding: number;
    lineColor: number;
  };
};

function curve(phase: number) {
  return Math.pow(Math.sin(phase), 2);
}

function drawCurve(
  form: paper.Group,
  size: paper.Size,
  padding: number,
  height: number,
  amplitude: number,
  strokeColor: paper.Color,
  strokeWidth: number,
) {
  // Draw  curve
  const count = 100;
  const points = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const phase = t * Math.PI;
    const x = MathUtils.lerp(padding, size.width - padding, t);
    let y = curve(phase) * (height - padding) * amplitude;
    // Flip
    y = size.height - padding - y;
    points.push(new paper.Point(x, y));
  }

  const path = createLine(points, strokeColor, strokeWidth, form);
  form.addChild(path);
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

  // Update random calls to use seed

  // Graph grid
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

  const padding = settings.graph.padding * settings.exportScale;
  const height = size.height - padding;

  const lineColor = new paper.Color(1, 1, 1, settings.graph.lineColor);
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
  const titleFontSize = settings.graph.title.fontSize * settings.exportScale;
  const legendFontSize = settings.graph.legend.fontSize * settings.exportScale;
  const legendOffset = settings.graph.legend.offset * settings.exportScale;
  const labelColor = settings.strokeColor;

  // Y Axis labels
  const yAxisLabelCount = 3;
  for (let i = 0; i < yAxisLabelCount; i++) {
    const labelY = MathUtils.lerp(
      paper.view.size.height - padding,
      padding + legendFontSize,
      i / (yAxisLabelCount - 1),
    );
    const yAxisValue = (i / (yAxisLabelCount - 1)).toFixed(1);

    const label = new paper.PointText({
      point: [padding - legendOffset, labelY],
      content: yAxisValue,
      fillColor: labelColor,
      fontSize: legendFontSize,
      justification: "right",
      fontFamily: "Berlingske Serif Regular",
    });

    blueprint.addChild(label);
  }

  // X Axis labels
  const xAxisLabelCount = 5;
  const xAxisValueStart = 0;
  const xAxisValueEnd = 180; // Phase in degrees (0 to π)

  for (let i = 0; i < xAxisLabelCount; i++) {
    const percent = i / (xAxisLabelCount - 1);
    const labelX = MathUtils.lerp(padding, size.width - padding, percent);

    let justification: "left" | "center" | "right" = "center";
    if (i === 0) {
      justification = "left";
    } else if (i === xAxisLabelCount - 1) {
      justification = "right";
    }

    const frequencyValue = Math.round(
      MathUtils.lerp(xAxisValueStart, xAxisValueEnd, percent),
    );

    const label = new paper.PointText({
      point: [labelX, paper.view.size.height - padding + legendOffset * 2],
      content: `${frequencyValue}°`,
      fillColor: labelColor,
      fontSize: legendFontSize,
      justification,
      fontFamily: "Berlingske Serif Regular",
    });

    blueprint.addChild(label);
  }

  const graphTitle = new paper.PointText({
    point: [center.x, paper.view.size.height - padding / 2],
    content: "p(x) = |ψ(x)|²",
    fillColor: labelColor,
    fontSize: titleFontSize,
    justification: "center",
    fontFamily: "Berlingske Serif Regular",
  });
  blueprint.addChild(graphTitle);

  // Draw curve here
  // if (settings.graph.curve.visible) {
  //   drawCurve(
  //     form,
  //     size,
  //     padding,
  //     height,
  //     1,
  //     settings.strokeColor,
  //     settings.graph.curve.strokeWidth,
  //   );
  // }

  // Draw particles according to probability density
  const particleColor = new paper.Color(1, 1, 1, 1);
  const curveStrokeColor = new paper.Color(
    1,
    1,
    1,
    settings.graph.curve.strokeColor,
  );

  for (let i = 0; i < settings.graph.particles.count; i++) {
    // 1. Uniform x
    const t = mathSeeded.random();
    const phase = t * Math.PI;

    // 2. Phase → x
    const x = MathUtils.lerp(padding, size.width - padding, t);

    // 3. Evaluate curve at that phase (single-valued)
    const probability = curve(phase);

    const yNorm = mathSeeded.random();
    if (yNorm > probability) continue;

    // 4. Sample vertically under the curve
    const v = mathSeeded.random();
    let y = probability * v * (height - padding);

    // flip y to match graph orientation
    y = size.height - y;
    // Add padding offset
    y -= padding;

    if (settings.graph.curve.visible) {
      drawCurve(
        form,
        size,
        padding,
        height,
        v,
        curveStrokeColor,
        settings.graph.curve.strokeWidth * settings.exportScale,
      );
    }

    // 4. Draw particle
    if (settings.graph.particles.visible) {
      dot(
        new paper.Point(x, y),
        settings.graph.particles.radius * settings.exportScale,
        form,
        particleColor,
      );
    }
  }

  return form;
}
