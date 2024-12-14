import paper from "paper";
import { MathUtils } from "three";

import { createCircle, debugPoints, lerp } from "../utils";

export function goldenRectangle(
  center: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  outlineVisible = false,
) {
  const group = new paper.Group();

  // Draw the outline circle
  const outlinePath = new paper.Path.Circle(center, radius);
  outlinePath.strokeColor = strokeColor;
  outlinePath.strokeWidth = strokeWidth;
  if (!outlineVisible) outlinePath.visible = false;
  group.addChild(outlinePath);

  // Golden ratio
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  // Circle's diameter
  const diameter = 2 * radius;

  // Calculate rectangle dimensions
  const width = Math.sqrt(diameter ** 2 / (1 + 1 / goldenRatio ** 2));
  const height = width / goldenRatio;

  // Create the rectangle centered on the circle
  const rectangle = new paper.Path.Rectangle(
    new paper.Point(center.x - width / 2, center.y - height / 2),
    new paper.Point(center.x + width / 2, center.y + height / 2),
  );
  rectangle.strokeColor = new paper.Color(1, 1, 1, 0.25);
  rectangle.strokeWidth = strokeWidth;

  // Add the rectangle to the group
  group.addChild(rectangle);

  // Division
  let parent = rectangle;
  const clockwise = [0, 90, 180, 270];
  let index = 0;
  for (let i = 0; i < 10; i++) {
    const x = parent.bounds.left;
    const y = parent.bounds.top;

    const clockwiseIndex = clockwise[index % clockwise.length];

    const topLeftPoint = new paper.Point(0, 0);
    const bottomLeftPoint = new paper.Point(0, 0);
    const topRightPoint = new paper.Point(0, 0);
    const bottomRightPoint = new paper.Point(0, 0);
    const parentWidth = Math.max(parent.bounds.width, parent.bounds.height);
    const parentHeight = Math.min(parent.bounds.width, parent.bounds.height);
    let leftPosition = new paper.Point(0, 0);
    let leftSize = new paper.Size(0, 0);
    let rightPosition = new paper.Point(0, 0);
    let rightSize = new paper.Size(0, 0);

    switch (clockwiseIndex) {
      case 0: {
        topLeftPoint.x = x;
        topLeftPoint.y = y;
        bottomLeftPoint.x = x;
        bottomLeftPoint.y = y + parentHeight;
        topRightPoint.x = x + parentWidth;
        topRightPoint.y = y;
        bottomRightPoint.x = x + parentWidth;
        bottomRightPoint.y = y + parentHeight;
        leftPosition = topLeftPoint;
        leftSize = new paper.Size(
          MathUtils.lerp(0, parentWidth, 1 / goldenRatio),
          parentHeight,
        );
        rightPosition = new paper.Point(
          leftPosition.x + leftSize.width,
          topLeftPoint.y,
        );
        rightSize = new paper.Size(parentWidth - leftSize.width, parentHeight);
        break;
      }
      case 90: {
        topLeftPoint.x = x;
        topLeftPoint.y = y + parentWidth;
        bottomLeftPoint.x = x + parentHeight;
        bottomLeftPoint.y = y + parentWidth;
        topRightPoint.x = x;
        topRightPoint.y = y;
        bottomRightPoint.x = x + parentHeight;
        bottomRightPoint.y = y;
        leftPosition = new paper.Point(
          topLeftPoint.x,
          topLeftPoint.y - parentWidth / goldenRatio,
        );
        leftSize = new paper.Size(
          MathUtils.lerp(0, parentWidth, 1 / goldenRatio),
          parentHeight,
        );
        rightPosition = new paper.Point(leftPosition.x, topRightPoint.y);
        rightSize = new paper.Size(
          parentWidth / goldenRatio,
          parentHeight / goldenRatio,
        );
        break;
      }
      case 180: {
        topLeftPoint.x = x + parentWidth;
        topLeftPoint.y = y + parentHeight;
        bottomLeftPoint.x = x + parentWidth;
        bottomLeftPoint.y = y;
        bottomRightPoint.x = x;
        bottomRightPoint.y = y;
        topRightPoint.x = x;
        topRightPoint.y = y + parentHeight;
        leftPosition = new paper.Point(
          topLeftPoint.x - parentWidth / goldenRatio,
          topLeftPoint.y - parentWidth / goldenRatio,
        );
        leftSize = new paper.Size(parentWidth / goldenRatio, parentHeight);
        rightPosition = new paper.Point(
          topRightPoint.x,
          topRightPoint.y - parentHeight,
        );
        rightSize = new paper.Size(
          parentWidth - parentWidth / goldenRatio,
          parentHeight,
        );
        break;
      }
      case 270: {
        topLeftPoint.x = x + parentHeight;
        topLeftPoint.y = y;
        bottomRightPoint.x = x;
        bottomRightPoint.y = y + parentWidth;
        bottomLeftPoint.x = x;
        bottomLeftPoint.y = y;
        topRightPoint.x = x + parentHeight;
        topRightPoint.y = y + parentWidth;
        leftPosition = new paper.Point(
          topLeftPoint.x - parentHeight,
          topLeftPoint.y,
        );
        leftSize = new paper.Size(parentWidth / goldenRatio, parentHeight);
        rightPosition = new paper.Point(
          bottomLeftPoint.x,
          topLeftPoint.y + parentHeight,
        );
        rightSize = new paper.Size(parentHeight, parentHeight / goldenRatio);
        break;
      }
    }

    // Split the rectangle
    const left = new paper.Path.Rectangle(leftPosition, leftSize);
    const right = new paper.Path.Rectangle(rightPosition, rightSize);

    left.strokeColor = strokeColor;
    right.strokeColor = strokeColor;

    // if (i === 3) {
    //   createCircle(topLeftPoint, 2, colors[i], 5);
    //   createCircle(bottomLeftPoint, 2, colors[i], 5);
    //   createCircle(bottomRightPoint, 2, colors[i], 5);
    //   createCircle(topRightPoint, 2, colors[i], 5);
    // }

    parent = right;
    index++;
  }

  return group;
}
