import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle, createLine, lerp } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type Tetrahedron64StarSettings = {
  blueprint: {
    circles: boolean;
  };
  form: {
    creation: boolean;
    triangles: boolean;
    masculinity: boolean;
    femininity: boolean;
    architecture: boolean;
    dimension0: boolean;
    dimension1: boolean;
    dimension2: boolean;
    dimension3: boolean;
    dimension4: boolean;
    dimension5: boolean;
    union: boolean;
  };
};

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
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  settings: SketchSettings & Tetrahedron64StarSettings,
) {
  const group = new paper.Group();
  const total = 6;
  const dimensions = 2;
  const innerRadius = radius / dimensions;
  const startAngle = -Math.PI / 6;

  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  if (settings.blueprint.creation) {
    createCircle(
      center,
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      blueprint,
    );
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
        if (settings.blueprint.circles) {
          createCircle(
            p,
            innerRadius,
            settings.strokeColor,
            settings.strokeWidth,
            blueprint,
          );
        }
      }
    }
  }

  // Create hexagon
  // Draw hexagon
  let hexagonPoints: paper.Point[] = [];

  for (let i = 0; i < total; i++) {
    const theta = Math.PI / 6 + i * (TWO_PI / total);
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
  //   form,
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

  if (settings.form.masculinity) {
    createLine(
      [...masculineTrianglePoints, masculineTrianglePoints[0]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  if (settings.form.femininity) {
    createLine(
      [...feminineTrianglePoints, feminineTrianglePoints[0]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  if (settings.form.architecture) {
    // Create hexagon
    createLine(
      [...hexagonMidPoints, hexagonMidPoints[0]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
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

  if (settings.form.dimension0) {
    // Create inner masculine triangle
    createLine(
      [...innerMasculineTrianglePoints, innerMasculineTrianglePoints[0]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );

    // Create inner feminine triangle
    createLine(
      [...innerFeminineTrianglePoints, innerFeminineTrianglePoints[0]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
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

  if (settings.form.dimension1) {
    createLine(
      [...innerFeminineTrianglePoints, innerFeminineTrianglePoints[0]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );

    createLine(
      [...inner2MasculineTrianglePoints, inner2MasculineTrianglePoints[0]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );

    createLine(
      [...inner2FeminineTrianglePoints, inner2FeminineTrianglePoints[0]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  // debugPoints(feminineTriangleMidPoints, new paper.Color(0, 1, 0));
  // debugPoints(feminineTriangleMidPoints, new paper.Color(0, 1, 0));

  // hexagon triangles
  if (settings.form.dimension2) {
    createLine(
      [
        hexagonMidPoints[4],
        hexagonMidPoints[0],
        hexagonMidPoints[2],
        hexagonMidPoints[4],
      ],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [
        hexagonMidPoints[3],
        hexagonMidPoints[1],
        hexagonMidPoints[5],
        hexagonMidPoints[3],
      ],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  // Horizontal lines
  if (settings.form.dimension3) {
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
      settings.strokeColor,
      settings.strokeWidth,
      form,
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
      settings.strokeColor,
      settings.strokeWidth,
      form,
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
      settings.strokeColor,
      settings.strokeWidth,
      form,
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
      settings.strokeColor,
      settings.strokeWidth,
      form,
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
      settings.strokeColor,
      settings.strokeWidth,
      form,
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
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  if (settings.form.dimension4) {
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
      settings.strokeColor,
      settings.strokeWidth,
      form,
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
      settings.strokeColor,
      settings.strokeWidth,
      form,
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
      settings.strokeColor,
      settings.strokeWidth,
      form,
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
      settings.strokeColor,
      settings.strokeWidth,
      form,
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
      settings.strokeColor,
      settings.strokeWidth,
      form,
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
      settings.strokeColor,
      settings.strokeWidth,
      form,
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

  if (settings.form.dimension5) {
    cornerPoints.forEach((points, i) => {
      createLine(points, settings.strokeColor, settings.strokeWidth, form);
      createLine(
        [cornerPoints[i][0], cornerPoints[i][2]],
        settings.strokeColor,
        settings.strokeWidth,
        form,
      );
    });
  }

  if (settings.form.union) {
    // Lines
    createLine(
      [masculineTrianglePoints[0], feminineTrianglePoints[1]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [hexagonMidPoints[4], hexagonMidPoints[1]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [feminineTrianglePoints[0], masculineTrianglePoints[2]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [hexagonMidPoints[5], hexagonMidPoints[2]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [masculineTrianglePoints[1], feminineTrianglePoints[2]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [hexagonMidPoints[0], hexagonMidPoints[3]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }
}
