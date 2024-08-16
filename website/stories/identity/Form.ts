import paper from "paper";

import { DrawSettings, Settings } from "./types";

const TWO_PI = Math.PI * 2;

export function creation(
  settings: Settings,
  center: paper.Point,
  radius: number,
) {
  const group = new paper.Group();
  const path = new paper.Path.Circle(center, radius);
  path.strokeColor = settings.creation.color;
  path.strokeWidth = settings.creation.width;
  group.addChild(path);
  return group;
}

export function womanhood(
  settings: any,
  center: paper.Point,
  radius: number,
  innerRadius: number,
) {
  const group = new paper.Group();

  const startAngle = -Math.PI / 6;

  const points: paper.Point[][] = [[]];
  const drawCircles = false;
  for (let i = 0; i < 3; i++) {
    points[i] = [];
    const theta = startAngle + i * (TWO_PI / 3);
    for (let j = 0; j < 3; j++) {
      const r = j * (radius / 2.5);
      const x = center.x + Math.cos(theta) * r;
      const y = center.y + Math.sin(theta) * r;
      const point = new paper.Point(x, y);
      points[i].push(point);
      if (drawCircles) {
        const path = new paper.Path.Circle(point, innerRadius);
        path.strokeColor = settings.color;
        path.strokeWidth = settings.width;
        group.addChild(path);
      }
    }
  }

  const linePoints: paper.Point[] = [];
  for (let i = 0; i < 3; i++) {
    linePoints.push(points[i][2]);
  }
  linePoints.push(points[0][2]);

  const line = new paper.Path(linePoints);
  line.strokeColor = settings.color;
  line.strokeWidth = settings.width;

  group.addChild(line);

  return group;
}

export function stars(
  settings: Settings,
  center: paper.Point,
  radius: number,
  innerRadius: number,
) {
  const group = new paper.Group();

  const drawCircles = true;
  const startAngle = -Math.PI / 2;
  const length = 12;
  const newRadius = innerRadius / 6;
  for (let i = 0; i < length; i++) {
    const theta = startAngle + i * (TWO_PI / length);
    for (let j = 0; j < 3; j++) {
      const r = j * (radius / 2.5);
      const x = center.x + Math.cos(theta) * r;
      const y = center.y + Math.sin(theta) * r;
      const point = new paper.Point(x, y);
      const inner = j === 1 && i % 2 === 0;
      if (j === 2 || inner) {
        const path = new paper.Path.Circle(point, newRadius);
        path.fillColor =
          inner && i % 4 === 0
            ? settings.icoshahedron.back.color
            : settings.stars.color;

        group.addChild(path);
      }
      if (drawCircles) {
        const path = new paper.Path.Circle(point, innerRadius);
        path.strokeColor = settings.debug.color;
        path.strokeWidth = settings.debug.width;
        group.addChild(path);
      }
    }
  }
  return group;
}

export function realm(
  settings: Settings,
  center: paper.Point,
  radius: number,
  innerRadius: number,
) {
  const group = new paper.Group();
  const circle = new paper.Path.Circle(center, innerRadius / 2);
  circle.strokeColor = settings.realm.color;
  circle.strokeWidth = settings.realm.width;
  group.addChild(circle);
  return group;
}

export function moon(
  settings: Settings,
  center: paper.Point,
  radius: number,
  innerRadius: number,
) {
  const group = new paper.Group();
  const points = [];
  const drawCircles = false;
  const startAngle = -Math.PI / 2;
  const theta = startAngle;
  for (let j = 0; j < 3; j++) {
    const r = j * (radius / 2.5);
    const x = center.x + Math.cos(theta) * r;
    const y = center.y + Math.sin(theta) * r;
    const point = new paper.Point(x, y);
    points.push(point);
    if (drawCircles) {
      const path = new paper.Path.Circle(point, innerRadius);
      path.strokeColor = settings.debug.color;
      path.strokeWidth = settings.debug.width;
      group.addChild(path);
    }
  }

  const newRadius = innerRadius / 2;

  let p = points[2].clone().subtract(new paper.Point(0, newRadius * 1.75));

  const outerPath = new paper.Path.Circle(p, newRadius);
  outerPath.fillColor = settings.moon.color;

  const inset = p.clone().subtract(new paper.Point(0, newRadius / 2));
  const innerPath = new paper.Path.Circle(inset, newRadius * 1.25);
  innerPath.fillColor = settings.moon.color;

  const result = outerPath.subtract(innerPath);
  result.fillColor = settings.moon.color;
  group.addChild(result);

  innerPath.remove();
  outerPath.remove();

  const opposite = result.clone();
  opposite.rotate(180);

  const distance = result.position.clone().subtract(center);
  opposite.position = new paper.Point(center.x, center.y - distance.y);

  group.addChild(opposite);

  return group;
}

function drawLine(settings: DrawSettings, points: paper.Point[]) {
  const line = new paper.Path(points);
  line.strokeColor = settings.color;
  line.strokeWidth = settings.width;
  return line;
}

export function structure(
  settings: Settings,
  center: paper.Point,
  radius: number,
  innerRadius: number,
  frontSide = true,
  backSide = true,
) {
  const group = new paper.Group();

  const startAngle = -Math.PI / 6;

  const points: paper.Point[][] = [[]];
  const drawCircles = true;
  const total = 6;
  for (let i = 0; i < total; i++) {
    points[i] = [];
    const theta = startAngle + i * (TWO_PI / total);
    for (let j = 0; j < 3; j++) {
      const r = j * (radius / 2.5);
      const x = center.x + Math.cos(theta) * r;
      const y = center.y + Math.sin(theta) * r;
      const point = new paper.Point(x, y);
      points[i].push(point);
      if (drawCircles) {
        const path = new paper.Path.Circle(point, innerRadius);
        path.strokeColor = settings.debug.color;
        path.strokeWidth = settings.debug.width;
        group.addChild(path);
      }
    }
  }

  let linePoints = [];

  if (backSide) {
    // Back
    linePoints = [];
    linePoints.push(points[0][2]);
    linePoints.push(points[2][2]);
    linePoints.push(points[4][2]);
    linePoints.push(points[0][2]);

    group.addChild(drawLine(settings.icoshahedron.back, linePoints));

    linePoints = [];
    linePoints.push(points[1][1]);
    linePoints.push(points[3][1]);
    linePoints.push(points[5][1]);
    linePoints.push(points[1][1]);

    group.addChild(drawLine(settings.icoshahedron.back, linePoints));

    linePoints = [];
    linePoints.push(points[5][1]);
    linePoints.push(points[5][2]);

    group.addChild(drawLine(settings.icoshahedron.back, linePoints));

    linePoints = [];
    linePoints.push(points[1][1]);
    linePoints.push(points[1][2]);

    group.addChild(drawLine(settings.icoshahedron.back, linePoints));

    linePoints = [];
    linePoints.push(points[3][1]);
    linePoints.push(points[3][2]);

    group.addChild(drawLine(settings.icoshahedron.back, linePoints));
  }

  if (frontSide) {
    // Front
    linePoints = [];
    linePoints.push(points[5][2]);
    linePoints.push(points[1][2]);
    linePoints.push(points[3][2]);
    linePoints.push(points[5][2]);

    group.addChild(drawLine(settings.icoshahedron.front, linePoints));

    linePoints = [];
    linePoints.push(points[0][1]);
    linePoints.push(points[2][1]);
    linePoints.push(points[4][1]);
    linePoints.push(points[0][1]);

    group.addChild(drawLine(settings.icoshahedron.front, linePoints));

    linePoints = [];
    linePoints.push(points[0][1]);
    linePoints.push(points[0][2]);

    group.addChild(drawLine(settings.icoshahedron.front, linePoints));

    linePoints = [];
    linePoints.push(points[2][1]);
    linePoints.push(points[2][2]);

    group.addChild(drawLine(settings.icoshahedron.front, linePoints));

    linePoints = [];
    linePoints.push(points[4][1]);
    linePoints.push(points[4][2]);

    group.addChild(drawLine(settings.icoshahedron.front, linePoints));

    linePoints = [];
    for (let i = 0; i < total; i++) {
      linePoints.push(points[i][2]);
    }
    linePoints.push(points[0][2]);

    // Outline
    group.addChild(drawLine(settings.icoshahedron.front, linePoints));
  }

  return group;
}
