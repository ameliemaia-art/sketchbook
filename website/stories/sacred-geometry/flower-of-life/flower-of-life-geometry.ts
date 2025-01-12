import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import {
  createCircle,
  createLine,
  dot,
  lerp,
} from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type FlowerOfLifeSettings = {
  blueprint: {
    lines: boolean;
    structure: boolean;
  };
  form: {
    dimensions: number;
    petals: boolean;
    circles: boolean;
  };
};

function createFlowerCircle(
  center: paper.Point,
  innerRadius: number,
  startAngle: number,
  strokeColor: paper.Color,
  strokeWidth: number,
) {
  const group = new paper.Group();

  const total = 6;
  const points: paper.Point[] = [];
  const outlineRadius = innerRadius;
  for (let j = 0; j < total; j++) {
    const theta = startAngle + (TWO_PI / total) * j;
    const x = center.x + Math.cos(theta) * outlineRadius;
    const y = center.y + Math.sin(theta) * outlineRadius;
    points.push(new paper.Point(x, y));
  }

  // const line = new paper.Path([...points, points[0]]);
  // line.strokeColor = strokeColor;
  // line.strokeWidth = strokeWidth;

  const c0 = new paper.Path.Circle(
    new paper.Point(points[0].x, lerp(points[0], points[1], 0.5).y),
    innerRadius,
  );
  c0.strokeColor = strokeColor;
  c0.strokeWidth = strokeWidth;
  const c1 = new paper.Path.Circle(
    new paper.Point(points[3].x, lerp(points[3], points[4], 0.5).y),
    innerRadius,
  );
  c1.strokeColor = strokeColor;
  c1.strokeWidth = strokeWidth;

  // Intersection path of the petal
  const petal = c0.intersect(c1);

  c0.remove();
  c1.remove();

  for (let i = 0; i < total; i++) {
    // Center petals
    let angle = 360 / total;
    const centerPetal = petal.clone();
    centerPetal.position.y = points[4].y;
    centerPetal.rotate(angle * i, center);

    // Edge petals
    const p0 = points[i];
    const p1 = points[i === total - 1 ? 0 : i + 1];
    const middle = lerp(p0, p1, 0.5);
    const sidePetal = petal.clone();
    sidePetal.position = middle;
    sidePetal.rotate(angle * i, middle);
    group.addChild(centerPetal);
    group.addChild(sidePetal);
  }
  petal.remove();
  return group;
}

export function flowerOfLife(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  settings: SketchSettings & FlowerOfLifeSettings,
) {
  const dotRadius = radius * 0.01;
  const total = 6;
  const innerRadius = radius / settings.form.dimensions;
  const startAngle = -Math.PI / 6;

  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  if (settings.form.circles) {
    createCircle(
      center,
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  const flowerCircle = createFlowerCircle(
    center,
    innerRadius,
    startAngle,
    settings.strokeColor,
    settings.strokeWidth,
  );

  for (let i = 0; i < settings.form.dimensions - 1; i++) {
    const points: paper.Point[] = [];
    const outlineRadius = innerRadius * (i + 1);
    for (let j = 0; j < total; j++) {
      const theta = startAngle + (TWO_PI / total) * j;
      const x = center.x + Math.cos(theta) * outlineRadius;
      const y = center.y + Math.sin(theta) * outlineRadius;
      points.push(new paper.Point(x, y));
    }

    const length = points.length;
    for (let k = 0; k < length; k++) {
      const p0 = points[k];
      const p1 = points[k === length - 1 ? 0 : k + 1];

      const circlesPerDimension = i + 2;
      for (let l = 0; l < circlesPerDimension; l++) {
        const t = l / (circlesPerDimension - 1);
        const p = lerp(p0, p1, t);
        if (settings.form.circles) {
          if (settings.form.petals) {
            const petal = flowerCircle.clone();
            petal.position = p;
            form.addChild(petal);
          } else {
            createCircle(
              p,
              innerRadius,
              settings.strokeColor,
              settings.strokeWidth,
              form,
            );
          }
        }
      }
    }

    // draw line between points
    if (settings.blueprint.lines) {
      const line = new paper.Path([...points, points[0]]);
      line.strokeColor = settings.strokeColor;
      line.strokeWidth = settings.strokeWidth;
      blueprint.addChild(line);
      // Front lines of cube
      createLine(
        [points[0], center],
        settings.strokeColor,
        settings.strokeWidth,
        blueprint,
      );
      createLine(
        [center, points[2]],
        settings.strokeColor,
        settings.strokeWidth,
        blueprint,
      );
      createLine(
        [center, points[4]],
        settings.strokeColor,
        settings.strokeWidth,
        blueprint,
      );
      // Back lines of cube
      createLine(
        [points[5], center],
        settings.strokeColor,
        settings.strokeWidth,
        blueprint,
      );
      createLine(
        [points[1], center],
        settings.strokeColor,
        settings.strokeWidth,
        blueprint,
      );
      createLine(
        [points[3], center],
        settings.strokeColor,
        settings.strokeWidth,
        blueprint,
      );
    }

    // Draw dots at corners of cube
    if (settings.blueprint.structure) {
      dot(points[0], dotRadius, blueprint);
      dot(points[1], dotRadius, blueprint);
      dot(points[2], dotRadius, blueprint);
      dot(points[3], dotRadius, blueprint);
      dot(points[4], dotRadius, blueprint);
      dot(points[5], dotRadius, blueprint);
      // dot(center, dotRadius, group);
    }
  }

  flowerCircle.remove();
}
