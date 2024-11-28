import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle, createLine, lerp } from "../utils";

function createMidPoints(points: paper.Point[]) {
  const midPoints: paper.Point[] = [];
  for (let i = 0; i < points.length; i++) {
    const p0 = points[i];
    const p1 = points[i === points.length - 1 ? 0 : i + 1];
    midPoints.push(p0.add(p1).divide(2));
  }
  return midPoints;
}

export function tetrahedron64Star(
  center: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  outline = false,
  circles = false,
  masculinity = true,
  femininity = true,
  structure = true,
  layer0 = true,
  layer1 = true,
  layer2 = true,
  layer3 = true,
  layer4 = true,
  layer5 = true,
  layer6 = true,
) {
  const group = new paper.Group();

  if (outline) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = strokeColor;
    path.strokeWidth = strokeWidth;
    group.addChild(path);
  }

  // Line from center
  let total = 6;
  const dimensions = 2;
  let innerRadius = radius / dimensions;
  const startAngle = -Math.PI / 6;

  if (circles) {
    createCircle(center, innerRadius, strokeColor, strokeWidth, group);
  }

  // Same setup as flowerOfLife
  for (let i = 0; i < dimensions - 1; i++) {
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
        if (circles) {
          createCircle(p, innerRadius, strokeColor, strokeWidth, group);
        }
      }
    }
  }

  // Create hexagon
  // Draw hexagon
  let hexagonPoints: paper.Point[] = [];

  length = 6;
  for (let i = 0; i < length; i++) {
    const theta = Math.PI / 6 + i * (TWO_PI / length);
    const x = center.x + Math.cos(theta) * radius;
    const y = center.y + Math.sin(theta) * radius;
    hexagonPoints.push(new paper.Point(x, y));
  }

  const hexagonMidPoints: paper.Point[] = createMidPoints(hexagonPoints);
  const hexagonInnerMidPoints: paper.Point[] =
    createMidPoints(hexagonMidPoints);

  // Create circles
  // debugPoints(hexagonInnerMidPoints, new paper.Color(1, 0, 0));

  // createLine(
  //   [...hexagonPoints, hexagonPoints[0]],
  //   new paper.Color(0, 1, 0, 1),
  //   strokeWidth,
  //   group,
  // );

  // Create masculine triangle
  const masculineTrianglePoints: paper.Point[] = [
    hexagonPoints[4],
    hexagonPoints[0],
    hexagonPoints[2],
  ];

  const feminineTrianglePoints: paper.Point[] = [
    hexagonPoints[5],
    hexagonPoints[1],
    hexagonPoints[3],
  ];

  const masculineTriangleMidPoints: paper.Point[] = createMidPoints(
    masculineTrianglePoints,
  );
  const feminineTriangleMidPoints: paper.Point[] = createMidPoints(
    feminineTrianglePoints,
  );

  // debugPoints(feminineTriangleMidPoints, new paper.Color(0, 1, 0));
  // debugPoints(masculineTriangleMidPoints, new paper.Color(0, 1, 0));

  if (masculinity) {
    createLine(
      [...masculineTrianglePoints, masculineTrianglePoints[0]],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  if (femininity) {
    createLine(
      [...feminineTrianglePoints, feminineTrianglePoints[0]],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  if (structure) {
    // Create hexagon
    createLine(
      [...hexagonMidPoints, hexagonMidPoints[0]],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  const innerMasculineTrianglePoints: paper.Point[] = [
    hexagonInnerMidPoints[5],
    hexagonInnerMidPoints[1],
    hexagonInnerMidPoints[3],
  ];
  const innerFeminineTrianglePoints: paper.Point[] = [
    hexagonInnerMidPoints[4],
    hexagonInnerMidPoints[0],
    hexagonInnerMidPoints[2],
  ];

  const innerMasculineTriangleMidPoints: paper.Point[] = createMidPoints(
    innerMasculineTrianglePoints,
  );
  const innerFeminineTriangleMidPoints: paper.Point[] = createMidPoints(
    innerFeminineTrianglePoints,
  );

  if (layer0) {
    // Create inner masculine triangle
    createLine(
      [...innerMasculineTrianglePoints, innerMasculineTrianglePoints[0]],
      strokeColor,
      strokeWidth,
      group,
    );

    // Create inner feminine triangle
    createLine(
      [...innerFeminineTrianglePoints, innerFeminineTrianglePoints[0]],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  // Inner masculine triangle
  const inner2MasculineTrianglePoints: paper.Point[] = [
    feminineTriangleMidPoints[0],
    feminineTriangleMidPoints[1],
    feminineTriangleMidPoints[2],
  ];
  const inner2FeminineTrianglePoints: paper.Point[] = [
    masculineTriangleMidPoints[0],
    masculineTriangleMidPoints[1],
    masculineTriangleMidPoints[2],
  ];

  if (layer1) {
    createLine(
      [...innerFeminineTrianglePoints, innerFeminineTrianglePoints[0]],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [...inner2MasculineTrianglePoints, inner2MasculineTrianglePoints[0]],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [...inner2FeminineTrianglePoints, inner2FeminineTrianglePoints[0]],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  // debugPoints(feminineTriangleMidPoints, new paper.Color(0, 1, 0));
  // debugPoints(feminineTriangleMidPoints, new paper.Color(0, 1, 0));

  // hexagon triangles
  if (layer2) {
    createLine(
      [
        hexagonMidPoints[4],
        hexagonMidPoints[0],
        hexagonMidPoints[2],
        hexagonMidPoints[4],
      ],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [
        hexagonMidPoints[3],
        hexagonMidPoints[1],
        hexagonMidPoints[5],
        hexagonMidPoints[3],
      ],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  // Horizontal lines
  if (layer3) {
    createLine(
      [
        lerp(
          feminineTrianglePoints[0],
          feminineTrianglePoints[1],
          1 / 6 + 1 / 6 / 2,
        ),
        lerp(
          feminineTrianglePoints[1],
          feminineTrianglePoints[2],
          4 / 6 + 1 / 6 / 2,
        ),
      ],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [
        lerp(
          masculineTrianglePoints[1],
          masculineTrianglePoints[0],
          1 / 6 + 1 / 6 / 2,
        ),
        lerp(
          masculineTrianglePoints[2],
          masculineTrianglePoints[0],
          1 / 6 + 1 / 6 / 2,
        ),
      ],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [
        lerp(
          feminineTrianglePoints[2],
          feminineTrianglePoints[0],
          4 / 6 + 1 / 6 / 2,
        ),
        lerp(
          feminineTrianglePoints[1],
          feminineTrianglePoints[2],
          1 / 6 + 1 / 6 / 2,
        ),
      ],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [
        lerp(
          masculineTrianglePoints[1],
          masculineTrianglePoints[0],
          4 / 6 + 1 / 6 / 2,
        ),
        lerp(
          masculineTrianglePoints[1],
          masculineTrianglePoints[2],
          4 / 6 + 1 / 6 / 2,
        ),
      ],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [
        lerp(
          feminineTrianglePoints[2],
          feminineTrianglePoints[0],
          1 / 6 + 1 / 6 / 2,
        ),
        lerp(
          feminineTrianglePoints[0],
          feminineTrianglePoints[1],
          4 / 6 + 1 / 6 / 2,
        ),
      ],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [
        lerp(
          masculineTrianglePoints[2],
          masculineTrianglePoints[0],
          4 / 6 + 1 / 6 / 2,
        ),
        lerp(
          masculineTrianglePoints[1],
          masculineTrianglePoints[2],
          1 / 6 + 1 / 6 / 2,
        ),
      ],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  if (layer4) {
    // Vertical lines
    createLine(
      [
        lerp(
          masculineTrianglePoints[0],
          masculineTrianglePoints[1],
          1 / 6 + 1 / 6 / 2,
        ),
        lerp(
          feminineTrianglePoints[0],
          feminineTrianglePoints[1],
          4 / 6 + 1 / 6 / 2,
        ),
      ],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [
        lerp(
          masculineTrianglePoints[2],
          masculineTrianglePoints[0],
          4 / 6 + 1 / 6 / 2,
        ),
        lerp(
          feminineTrianglePoints[1],
          feminineTrianglePoints[2],
          1 / 6 + 1 / 6 / 2,
        ),
      ],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [
        lerp(
          feminineTrianglePoints[2],
          feminineTrianglePoints[0],
          4 / 6 + 1 / 6 / 2,
        ),
        lerp(
          masculineTrianglePoints[2],
          masculineTrianglePoints[0],
          1 / 6 + 1 / 6 / 2,
        ),
      ],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [
        lerp(
          feminineTrianglePoints[0],
          feminineTrianglePoints[1],
          1 / 6 + 1 / 6 / 2,
        ),
        lerp(
          masculineTrianglePoints[1],
          masculineTrianglePoints[2],
          4 / 6 + 1 / 6 / 2,
        ),
      ],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [
        lerp(
          feminineTrianglePoints[2],
          feminineTrianglePoints[0],
          1 / 6 + 1 / 6 / 2,
        ),
        lerp(
          masculineTrianglePoints[0],
          masculineTrianglePoints[1],
          4 / 6 + 1 / 6 / 2,
        ),
      ],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [
        lerp(
          feminineTrianglePoints[1],
          feminineTrianglePoints[2],
          4 / 6 + 1 / 6 / 2,
        ),
        lerp(
          masculineTrianglePoints[1],
          masculineTrianglePoints[2],
          1 / 6 + 1 / 6 / 2,
        ),
      ],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  // Points for the inner hexagon corners
  const cornerPoints: paper.Point[][] = [
    [
      lerp(hexagonInnerMidPoints[3], hexagonInnerMidPoints[4], 4 / 6),
      hexagonInnerMidPoints[4],
      lerp(hexagonInnerMidPoints[4], hexagonInnerMidPoints[5], 2 / 6),
    ],
    [
      lerp(hexagonInnerMidPoints[4], hexagonInnerMidPoints[5], 4 / 6),
      hexagonInnerMidPoints[5],
      lerp(hexagonInnerMidPoints[5], hexagonInnerMidPoints[0], 2 / 6),
    ],
    [
      lerp(hexagonInnerMidPoints[5], hexagonInnerMidPoints[0], 4 / 6),
      hexagonInnerMidPoints[0],
      lerp(hexagonInnerMidPoints[0], hexagonInnerMidPoints[1], 2 / 6),
    ],
    [
      lerp(hexagonInnerMidPoints[0], hexagonInnerMidPoints[1], 4 / 6),
      hexagonInnerMidPoints[1],
      lerp(hexagonInnerMidPoints[1], hexagonInnerMidPoints[2], 2 / 6),
    ],
    [
      lerp(hexagonInnerMidPoints[1], hexagonInnerMidPoints[2], 4 / 6),
      hexagonInnerMidPoints[2],
      lerp(hexagonInnerMidPoints[2], hexagonInnerMidPoints[3], 2 / 6),
    ],
    [
      lerp(hexagonInnerMidPoints[2], hexagonInnerMidPoints[3], 4 / 6),
      hexagonInnerMidPoints[3],
      lerp(hexagonInnerMidPoints[3], hexagonInnerMidPoints[4], 2 / 6),
    ],
  ];

  if (layer5) {
    cornerPoints.forEach((points, i) => {
      createLine(points, strokeColor, strokeWidth, group);
      createLine(
        [cornerPoints[i][0], cornerPoints[i][2]],
        strokeColor,
        strokeWidth,
        group,
      );
    });
  }

  if (layer6) {
    // Lines
    createLine(
      [masculineTrianglePoints[0], feminineTrianglePoints[1]],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [hexagonMidPoints[4], hexagonMidPoints[1]],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [feminineTrianglePoints[0], masculineTrianglePoints[2]],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [hexagonMidPoints[5], hexagonMidPoints[2]],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [masculineTrianglePoints[1], feminineTrianglePoints[2]],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [hexagonMidPoints[0], hexagonMidPoints[3]],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  return group;
}
