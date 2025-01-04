import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import {
  createCircle,
  createGrid,
  createLine,
  filterIntersectionPositions,
} from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type PlatonicSettings = {
  strokeDepthColor: paper.Color;
  grid: {
    divisions: number;
    strokeColor: paper.Color;
  };
  guide: {
    strokeColor: paper.Color;
  };
  layers: {
    hexahedron: boolean;
    icosahedron: boolean;
    dodecahedron: boolean;
    tetrahedron: boolean;
    octahedron: boolean;
  };
};

function getAllIntersections(paths: paper.Path[]): paper.Point[] {
  const intersections: paper.Point[] = [];

  // Iterate over all pairs of paths
  for (let i = 0; i < paths.length; i++) {
    for (let j = i + 1; j < paths.length; j++) {
      // Get the intersections between the two paths
      const pathIntersections = paths[i].getIntersections(paths[j]);

      // Extract the intersection points and add to the list
      pathIntersections.forEach((intersection) => {
        intersections.push(intersection.point);
      });
    }
  }

  return intersections;
}

export function platonic(
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: SketchSettings & PlatonicSettings,
) {
  const group = new paper.Group();
  const total = 6;
  const innerRadius = radius / 5;
  const startAngle = -Math.PI / 6;

  createGrid(
    center,
    size,
    settings.grid.strokeColor,
    settings.strokeWidth,
    settings.grid.divisions,
    group,
  );
  createGrid(
    center,
    size,
    settings.grid.strokeColor,
    settings.strokeWidth,
    5,
    group,
  );

  if (settings.layers.outline) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    group.addChild(path);
  }

  createCircle(
    center,
    innerRadius,
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
  );

  const paths: paper.Path[] = [];
  const dimensions = 2;
  const points: paper.Point[][] = [];
  for (let i = 0; i < dimensions; i++) {
    const outlineRadius = innerRadius * 2 * (i + 1);
    points[i] = [];
    for (let j = 0; j < total; j++) {
      const theta = startAngle + (TWO_PI / total) * j;
      const x = center.x + Math.cos(theta) * outlineRadius;
      const y = center.y + Math.sin(theta) * outlineRadius;
      points[i].push(new paper.Point(x, y));
      createCircle(
        new paper.Point(x, y),
        innerRadius,
        settings.guide.strokeColor,
        settings.strokeWidth,
        group,
      );
    }

    const line = new paper.Path([...points[i], points[i][0]]);
    paths.push(line);
    line.strokeColor = settings.guide.strokeColor;
    line.strokeWidth = settings.strokeWidth;
    group.addChild(line);

    // Upwards triangle
    const upwardsTriangle = new paper.Path([
      points[i][1],
      points[i][3],
      points[i][5],
      points[i][1],
    ]);
    upwardsTriangle.strokeColor = settings.guide.strokeColor;
    upwardsTriangle.strokeWidth = settings.strokeWidth;
    group.addChild(upwardsTriangle);
    paths.push(upwardsTriangle);

    const downwardsTriangle = new paper.Path([
      points[i][0],
      points[i][2],
      points[i][4],
      points[i][0],
    ]);
    downwardsTriangle.strokeColor = settings.guide.strokeColor;
    downwardsTriangle.strokeWidth = settings.strokeWidth;
    group.addChild(downwardsTriangle);
    paths.push(downwardsTriangle);
  }

  // Draw lines between outer circles and inner circles
  for (let j = 0; j < 6; j++) {
    const p0 = (j + 2) % points[0].length;
    const p1 = (j + 3) % points[0].length;
    const p2 = (j + 4) % points[0].length;
    console.log(j, p0, p1, p2);
    const line0 = new paper.Path([points[1][j], points[0][p0]]);
    line0.strokeColor = settings.guide.strokeColor;
    line0.strokeWidth = settings.strokeWidth;
    const line1 = new paper.Path([points[1][j], points[0][p1]]);
    line1.strokeColor = settings.guide.strokeColor;
    line1.strokeWidth = settings.strokeWidth;
    const line2 = new paper.Path([points[1][j], points[0][p2]]);
    line2.strokeColor = settings.guide.strokeColor;
    line2.strokeWidth = settings.strokeWidth;
    group.addChild(line0);
    group.addChild(line1);
    group.addChild(line2);
    paths.push(line0, line1, line2);
  }

  const intersections = filterIntersectionPositions(getAllIntersections(paths));

  // debugPoints(
  //   intersections,
  //   new paper.Color(1, 0, 0, 1),
  //   settings.strokeWidth,
  //   10,
  //   true,
  //   20,
  //   new paper.Color(1, 1, 0, 1),
  // );

  if (settings.layers.tetrahedron) {
    // Front
    createLine(
      [
        intersections[50],
        intersections[48],
        intersections[49],
        intersections[50],
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[49], intersections[76], intersections[48]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[76], intersections[50]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.dodecahedron) {
    // Back
    createLine(
      [intersections[64], intersections[80], intersections[61]],
      settings.strokeDepthColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[80], intersections[76]],
      settings.strokeDepthColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[65], intersections[78], intersections[62]],
      settings.strokeDepthColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[60], intersections[73], intersections[63]],
      settings.strokeDepthColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[78], intersections[76], intersections[73]],
      settings.strokeDepthColor,
      settings.strokeWidth,
      group,
    );

    // Front
    createLine(
      [
        intersections[71],
        intersections[70],
        intersections[61],
        intersections[60],
        intersections[67],
        intersections[66],
        intersections[63],
        intersections[62],
        intersections[69],
        intersections[68],
        intersections[65],
        intersections[64],
        intersections[71],
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [
        intersections[71],
        intersections[86],
        intersections[76],
        intersections[77],
        intersections[70],
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[68], intersections[86]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[67], intersections[77]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[69], intersections[84], intersections[66]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[76], intersections[84]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.hexahedron) {
    // Back
    createLine(
      [intersections[49], intersections[76], intersections[48]],
      settings.strokeDepthColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[76], intersections[50]],
      settings.strokeDepthColor,
      settings.strokeWidth,
      group,
    );

    // Front
    createLine(
      [
        intersections[50],
        intersections[51],
        intersections[48],
        intersections[52],
        intersections[49],
        intersections[53],
        intersections[50],
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[53], intersections[76], intersections[51]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[76], intersections[52]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.octahedron) {
    // Back
    createLine(
      [
        intersections[50],
        intersections[48],
        intersections[49],
        intersections[50],
      ],
      settings.strokeDepthColor,
      settings.strokeWidth,
      group,
    );

    // Front
    createLine(
      [
        intersections[50],
        intersections[51],
        intersections[48],
        intersections[52],
        intersections[49],
        intersections[53],
        intersections[50],
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [
        intersections[53],
        intersections[51],
        intersections[52],
        intersections[53],
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.icosahedron) {
    // Back
    createLine(
      [
        intersections[53],
        intersections[51],
        intersections[52],
        intersections[53],
      ],
      settings.strokeDepthColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[2], intersections[0], intersections[1], intersections[2]],
      settings.strokeDepthColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[2], intersections[50]],
      settings.strokeDepthColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[1], intersections[49]],
      settings.strokeDepthColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[0], intersections[48]],
      settings.strokeDepthColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[4], intersections[52]],
      settings.strokeDepthColor,
      settings.strokeWidth,
      group,
    );

    // Front
    createLine(
      [
        intersections[50],
        intersections[51],
        intersections[48],
        intersections[52],
        intersections[49],
        intersections[53],
        intersections[50],
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    // Triangle
    createLine(
      [
        intersections[50],
        intersections[48],
        intersections[49],
        intersections[50],
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[4], intersections[5], intersections[3], intersections[4]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[53], intersections[5]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [intersections[3], intersections[51]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  return group;
}
