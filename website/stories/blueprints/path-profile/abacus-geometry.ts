import { set } from "local-storage";
import paper from "paper";
import { CatmullRomCurve3, MathUtils, Vector3 } from "three";

import { saveJsonFile } from "@utils/common/file";
import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import {
  createCircle,
  dot,
  lerp,
  pointsToVector3,
  vector3ToPoints,
} from "@utils/paper/utils";

export type AbacusPath = {
  radius: number;
  cornerAngleOffset: number;
};

function getCirclePoint(angle: number, radius: number, center: paper.Point) {
  const x = center.x + Math.cos(angle) * radius;
  const y = center.y + Math.sin(angle) * radius;
  return new paper.Point(x, y);
}

function getCircleCenter() {}

export function abacusPath(
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: AbacusPath,
) {
  let points: paper.Point[] = [];

  // const path = new paper.Path.Circle(center, settings.radius * size.width);
  // path.strokeColor = new paper.Color(1, 1, 1, 1);

  // 4 corners

  const colors = [
    new paper.Color(1, 0, 0, 1),
    new paper.Color(0, 1, 0, 1),
    new paper.Color(0, 0, 1, 1),
    new paper.Color(1, 1, 0, 1),
  ];

  const p = [];
  for (let i = 0; i < 4; i++) {
    const angleA = (i * Math.PI) / 2;
    const angleB = ((i + 1) * Math.PI) / 2;

    const thetaA = angleA + MathUtils.degToRad(settings.cornerAngleOffset);
    const thetaB = angleB - MathUtils.degToRad(settings.cornerAngleOffset);

    const p0 = getCirclePoint(thetaA, settings.radius * size.width, center);
    const p1 = getCirclePoint(thetaB, settings.radius * size.width, center);

    dot(p0, 5, undefined, colors[i]);
    dot(p1, 5, undefined, colors[i]);

    const mid = lerp(p0.add(p1).divide(2), center, 0.7);

    dot(mid, 5, undefined, colors[i]);

    // Circle arc center
    // p.push(p0, p1);
  }

  return points;
}

/// #if DEBUG
export class GUIAbacusPath extends GUIController {
  constructor(
    gui: GUIType,
    public target: AbacusPath,
    title: string = "",
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: `Abacus Path: ${title}` });

    this.gui.addButton({ title: "Save" }).on("click", () => {
      saveJsonFile(JSON.stringify(target), "abacus");
    });
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
