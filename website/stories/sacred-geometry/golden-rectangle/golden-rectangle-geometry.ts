import paper from "paper";

import { createCircle } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type GoldenRectangleSettings = {
  divisions: number;
  layers: {
    background: boolean;
    outline: boolean;
    rectangle: boolean;
    subdivisions: boolean;
    spiral: boolean;
  };
};

export function goldenRectangle(
  center: paper.Point,
  radius: number,
  settings: SketchSettings & GoldenRectangleSettings,
) {
  const group = new paper.Group();
  const transparentColor = new paper.Color(0, 0, 0, 0);

  // Draw the outline circle
  const outlinePath = new paper.Path.Circle(center, radius);
  outlinePath.strokeColor = settings.strokeColor;
  outlinePath.strokeWidth = settings.strokeWidth;
  if (!settings.layers.outline) outlinePath.visible = false;
  group.addChild(outlinePath);

  // Golden ratio
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  // Circle's diameter
  const diameter = 2 * radius;

  // Calculate rectangle dimensions
  const width = Math.sqrt(diameter ** 2 / (1 + 1 / goldenRatio ** 2));
  const height = width / goldenRatio;

  // Create the rectangle centered on the circle
  const golden = new paper.Path.Rectangle(
    new paper.Point(center.x - width / 2, center.y - height / 2),
    new paper.Point(center.x + width / 2, center.y + height / 2),
  );
  golden.strokeColor = settings.layers.rectangle
    ? settings.strokeColor
    : transparentColor;
  golden.strokeWidth = settings.strokeWidth;

  // Add the rectangle to the group
  group.addChild(golden);

  // Division
  const rotations = [0, 90, 180, 270];
  let parent = golden;
  let index = 0;
  for (let i = 0; i < settings.divisions; i++) {
    const x = parent.bounds.left;
    const y = parent.bounds.top;

    const rotation = rotations[index % rotations.length];

    const corners = {
      tl: new paper.Point(0, 0),
      tr: new paper.Point(0, 0),
      bl: new paper.Point(0, 0),
      br: new paper.Point(0, 0),
    };

    const parentWidth = Math.max(parent.bounds.width, parent.bounds.height);
    const parentHeight = Math.min(parent.bounds.width, parent.bounds.height);

    const left = {
      position: new paper.Point(0, 0),
      size: new paper.Size(0, 0),
    };

    const right = {
      position: new paper.Point(0, 0),
      size: new paper.Size(0, 0),
    };

    const circle = {
      position: new paper.Point(0, 0),
      radius: 0,
    };

    switch (rotation) {
      case 0: {
        corners.tl.x = x;
        corners.tl.y = y;
        corners.bl.x = x;
        corners.bl.y = y + parentHeight;
        corners.tr.x = x + parentWidth;
        corners.tr.y = y;
        corners.br.x = x + parentWidth;
        corners.br.y = y + parentHeight;
        left.position = corners.tl;
        left.size.width = parentWidth * (1 / goldenRatio);
        left.size.height = parentHeight;
        right.position.x = left.position.x + left.size.width;
        right.position.y = corners.tl.y;
        right.size.width = parentWidth - left.size.width;
        right.size.height = parentHeight;
        circle.position = right.position;
        circle.radius = left.size.width;
        break;
      }
      case 90: {
        corners.tl.x = x;
        corners.tl.y = y + parentWidth;
        corners.bl.x = x + parentHeight;
        corners.bl.y = y + parentWidth;
        corners.tr.x = x;
        corners.tr.y = y;
        corners.br.x = x + parentHeight;
        corners.br.y = y;
        left.position.x = corners.tl.x;
        left.position.y = corners.tl.y - parentWidth / goldenRatio;
        left.size.width = parentWidth * (1 / goldenRatio);
        left.size.height = parentHeight;
        right.position.x = corners.tl.x;
        right.position.y = corners.tr.y;
        right.size.width = parentWidth / goldenRatio;
        right.size.height = parentHeight / goldenRatio;
        circle.position = left.position;
        circle.radius = right.size.width;
        break;
      }
      case 180: {
        corners.tl.x = x + parentWidth;
        corners.tl.y = y + parentHeight;
        corners.bl.x = x + parentWidth;
        corners.bl.y = y;
        corners.br.x = x;
        corners.br.y = y;
        corners.tr.x = x;
        corners.tr.y = y + parentHeight;
        left.position.x = corners.tl.x - parentWidth / goldenRatio;
        left.position.y = corners.tl.y - parentWidth / goldenRatio;
        left.size.width = parentWidth / goldenRatio;
        left.size.height = parentHeight;
        right.position.x = corners.tr.x;
        right.position.y = corners.tr.y - parentHeight;
        right.size.width = parentWidth - parentWidth / goldenRatio;
        right.size.height = parentHeight;

        circle.position = left.position.clone();
        circle.position.y += left.size.width;
        circle.radius = left.size.width;
        break;
      }
      case 270: {
        corners.tl.x = x + parentHeight;
        corners.tl.y = y;
        corners.br.x = x;
        corners.br.y = y + parentWidth;
        corners.bl.x = x;
        corners.bl.y = y;
        corners.tr.x = x + parentHeight;
        corners.tr.y = y + parentWidth;
        left.position.x = corners.tl.x - parentHeight;
        left.position.y = corners.tl.y;
        left.size.width = parentWidth / goldenRatio;
        left.size.height = parentHeight;
        right.position.x = corners.bl.x;
        right.position.y = corners.tl.y + parentHeight;
        right.size.width = parentHeight;
        right.size.height = parentHeight / goldenRatio;

        circle.position = left.position.clone();
        circle.position.y += left.size.width;
        circle.position.x += left.size.width;
        circle.radius = left.size.width;
        break;
      }
    }

    const leftPath = new paper.Path.Rectangle(left.position, left.size);
    const rightPath = new paper.Path.Rectangle(right.position, right.size);

    leftPath.strokeColor = settings.layers.subdivisions
      ? settings.strokeColor
      : transparentColor;
    rightPath.strokeColor = settings.layers.subdivisions
      ? settings.strokeColor
      : transparentColor;
    leftPath.strokeWidth = settings.strokeWidth;
    rightPath.strokeWidth = settings.strokeWidth;

    if (settings.layers.spiral) {
      const circlePath = createCircle(
        circle.position,
        circle.radius,
        settings.strokeColor,
        settings.strokeWidth,
      );
      const intersection = leftPath.intersect(circlePath);
      intersection.strokeWidth = settings.strokeWidth;
      circlePath.remove();
    }

    // if (i === 3) {
    //   createCircle(corners.tl, 2, new paper.Color(1, 0, 0, 1), 5);
    //   createCircle(corners.bl, 2, new paper.Color(0, 1, 0, 1), 5);
    //   createCircle(corners.br, 2, new paper.Color(0, 0, 1, 1), 5);
    //   createCircle(corners.tr, 2, new paper.Color(1, 1, 0, 1), 5);
    // }

    parent = rightPath;
    index++;
  }

  return group;
}
