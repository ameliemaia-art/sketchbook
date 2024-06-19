import paper from "paper";

const TWO_PI = Math.PI * 2;

export function creation(settings, center, radius) {
  const path = paper.Path.Circle(center, radius);
  path.strokeColor = settings.creation.color;
  path.strokeWidth = settings.creation.width;
}

export function womanhood(settings, center, radius, innerRadius) {
  const startAngle = -Math.PI / 6;

  const points = [[]];
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
        const path = paper.Path.Circle(point, innerRadius);
        path.strokeColor = settings.color;
        path.strokeWidth = settings.width;
      }
    }
  }

  const linePoints = [];
  for (let i = 0; i < 3; i++) {
    linePoints.push(points[i][2]);
  }
  linePoints.push(points[0][2]);

  const line = new paper.Path(linePoints);
  line.strokeColor = settings.color;
  line.strokeWidth = settings.width;
}

export function stars(settings, center, radius, innerRadius) {
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
        const path = paper.Path.Circle(point, newRadius);
        path.fillColor =
          inner && i % 4 === 0
            ? settings.icoshahedron.back.color
            : settings.stars.color;
      }
      if (drawCircles) {
        const path = paper.Path.Circle(point, innerRadius);
        path.strokeColor = settings.debug.color;
        path.strokeWidth = settings.debug.width;
      }
    }
  }
}

export function realm(settings, center, radius, innerRadius) {
  const circle = paper.Path.Circle(center, innerRadius / 2);
  circle.strokeColor = settings.realm.color;
  circle.strokeWidth = settings.realm.width;
}

export function moon(settings, center, radius, innerRadius) {
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
      const path = paper.Path.Circle(point, innerRadius);
      path.strokeColor = settings.debug.color;
      path.strokeWidth = settings.debug.width;
    }
  }

  const newRadius = innerRadius / 2;

  let p = points[2].clone().subtract(new paper.Point(0, newRadius * 1.75));

  const outerPath = paper.Path.Circle(p, newRadius);
  outerPath.fillColor = settings.moon.color;

  const inset = p.clone().subtract(new paper.Point(0, newRadius / 2));
  const innerPath = paper.Path.Circle(inset, newRadius * 1.25);
  innerPath.fillColor = settings.moon.color;

  const result = outerPath.subtract(innerPath);
  result.fillColor = settings.moon.color;

  innerPath.remove();
  outerPath.remove();

  const opposite = result.clone();
  opposite.rotate(180);

  const distance = result.position.clone().subtract(center);
  opposite.position = new paper.Point(center.x, center.y - distance.y);
}

function drawLine(settings, points) {
  const line = new paper.Path(points);
  line.strokeColor = settings.color;
  line.strokeWidth = settings.width;
}

export function structure(
  settings,
  center,
  radius,
  innerRadius,
  frontSide = true,
  backSide = true,
) {
  const startAngle = -Math.PI / 6;

  const points = [[]];
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
        const path = paper.Path.Circle(point, innerRadius);
        path.strokeColor = settings.debug.color;
        path.strokeWidth = settings.debug.width;
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

    drawLine(settings.icoshahedron.back, linePoints);

    linePoints = [];
    linePoints.push(points[1][1]);
    linePoints.push(points[3][1]);
    linePoints.push(points[5][1]);
    linePoints.push(points[1][1]);

    drawLine(settings.icoshahedron.back, linePoints);

    linePoints = [];
    linePoints.push(points[5][1]);
    linePoints.push(points[5][2]);

    drawLine(settings.icoshahedron.back, linePoints);

    linePoints = [];
    linePoints.push(points[1][1]);
    linePoints.push(points[1][2]);

    drawLine(settings.icoshahedron.back, linePoints);

    linePoints = [];
    linePoints.push(points[3][1]);
    linePoints.push(points[3][2]);

    drawLine(settings.icoshahedron.back, linePoints);
  }

  if (frontSide) {
    // Front
    linePoints = [];
    linePoints.push(points[5][2]);
    linePoints.push(points[1][2]);
    linePoints.push(points[3][2]);
    linePoints.push(points[5][2]);

    drawLine(settings.icoshahedron.front, linePoints);

    linePoints = [];
    linePoints.push(points[0][1]);
    linePoints.push(points[2][1]);
    linePoints.push(points[4][1]);
    linePoints.push(points[0][1]);

    drawLine(settings.icoshahedron.front, linePoints);

    linePoints = [];
    linePoints.push(points[0][1]);
    linePoints.push(points[0][2]);

    drawLine(settings.icoshahedron.front, linePoints);

    linePoints = [];
    linePoints.push(points[2][1]);
    linePoints.push(points[2][2]);

    drawLine(settings.icoshahedron.front, linePoints);

    linePoints = [];
    linePoints.push(points[4][1]);
    linePoints.push(points[4][2]);

    drawLine(settings.icoshahedron.front, linePoints);

    linePoints = [];
    for (let i = 0; i < total; i++) {
      linePoints.push(points[i][2]);
    }
    linePoints.push(points[0][2]);

    // Outline
    drawLine(settings.icoshahedron.front, linePoints);
  }
}
