import { set } from "local-storage";
import paper from "paper";
import { MathUtils } from "three";

import { saveJsonFile } from "@utils/common/file";
import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import { dot } from "@utils/paper/utils";

export type AbacusPath = {
  radius: number;
  cornerAngleOffset: number;
  subdivisions: number;
  curveOffset: number;
};

function getCirclePoint(angle: number, radius: number, center: paper.Point) {
  const x = center.x + Math.cos(angle) * radius;
  const y = center.y + Math.sin(angle) * radius;
  return new paper.Point(x, y);
}

export function abacusPath(
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: AbacusPath,
) {
  let points: paper.Point[] = [];

  const colors = [
    new paper.Color(1, 0, 0, 1),
    new paper.Color(0, 1, 0, 1),
    new paper.Color(0, 0, 1, 1),
    new paper.Color(1, 1, 0, 1),
  ];

  for (let i = 0; i < 4; i++) {
    const angleA = (i * Math.PI) / 2;
    const angleB = ((i + 1) * Math.PI) / 2;

    const thetaA = angleA + MathUtils.degToRad(settings.cornerAngleOffset);
    const thetaB = angleB - MathUtils.degToRad(settings.cornerAngleOffset);

    const p0 = getCirclePoint(thetaA, settings.radius * size.width, center);
    const p1 = getCirclePoint(thetaB, settings.radius * size.width, center);

    // dot(p0, 5, undefined, colors[i]);
    // dot(p1, 5, undefined, colors[i]);

    // Determine local corner arc center dynamically for each quadrant.
    // Pattern: even indices use (p0.x, p1.y), odd use (p1.x, p0.y)
    const arcCenter =
      i % 2 === 0 ? new paper.Point(p0.x, p1.y) : new paper.Point(p1.x, p0.y);

    const nx = arcCenter.x - center.x;
    const ny = arcCenter.y - center.y;
    const normal = new paper.Point(nx, ny).normalize();

    const offset = settings.curveOffset * size.width;
    arcCenter.x += offset * normal.x;
    arcCenter.y += offset * normal.y;

    // dot(arcCenter, 5, undefined, colors[i]);

    // console.log(`Corner Angle [${i}]:`, MathUtils.radToDeg(cornerAngle));

    const startAngle = Math.atan2(p0.y - arcCenter.y, p0.x - arcCenter.x);
    const endAngle = Math.atan2(p1.y - arcCenter.y, p1.x - arcCenter.x);

    // Normalize shortest signed angular difference
    let delta = endAngle - startAngle;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    points.push(p0); // include start point
    for (let j = 1; j < settings.subdivisions; j++) {
      const t = j / settings.subdivisions;
      const a = startAngle + delta * t;
      const rad = p0.getDistance(arcCenter);
      const x = Math.cos(a) * rad + arcCenter.x;
      const y = Math.sin(a) * rad + arcCenter.y;
      const pt = new paper.Point(x, y);
      points.push(pt);
      // dot(pt, 3, undefined, colors[i]);
    }
    points.push(p1); // include end point
  }

  points.push(points[0]); // include end point

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

    this.gui
      .addBinding(target, "cornerAngleOffset", { min: 0.1, max: 45 })
      .on("change", this.onChange);

    this.gui
      .addBinding(target, "subdivisions", { min: 5, max: 50, step: 1 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "curveOffset", { min: 0 })
      .on("change", this.onChange);

    this.gui.addButton({ title: "Save" }).on("click", () => {
      saveJsonFile(JSON.stringify(target), "abacus");
    });
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
