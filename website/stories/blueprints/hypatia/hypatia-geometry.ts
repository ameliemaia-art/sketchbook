import paper from "paper";
import { MathUtils } from "three";

import mathSeeded from "@utils/math-seeded";
import { createCircle, createLine } from "@utils/paper/utils";
import { TWO_PI } from "@utils/three/math";
import { SketchSettings } from "../sketch/sketch";

export type HypatiaSettings = {
  blueprint: {};
  form: {
    visible: boolean;
    opacity: number;
    outline: boolean;
    hypatia: {
      visible: boolean;
      radius: number;
    };
    stars: {
      visible: boolean;
      total: number;
      radius: number;
      color: number;
    };
    planets: {
      visible: boolean;
      color: number;
      spiral: number;
      radius: number;
    };
    orbit: {
      visible: boolean;
      color: number;
    };
    motion: {
      visible: boolean;
      color: number;
      dash: number;
    };
  };
};

function projectSphericalTo2D(
  theta: number,
  phi: number,
  radius: number,
  center: paper.Point,
) {
  // Convert spherical coordinates to Cartesian
  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.sin(phi) * Math.sin(theta);
  const z = Math.cos(phi); // Depth information

  // Simulate projection warping (apply z-depth compression)
  const perspectiveFactor = 1 - z * 0.5; // Warps toward center

  // Scale to fit perfectly inside the circle
  const scaledRadius = radius * perspectiveFactor;
  let projectedX = x * scaledRadius;
  let projectedY = y * scaledRadius;

  // **Ensure it stays within the radius** using normalization
  const distanceFromCenter = Math.sqrt(projectedX ** 2 + projectedY ** 2);
  if (distanceFromCenter > radius) {
    const scale = radius / distanceFromCenter;
    projectedX *= scale;
    projectedY *= scale;
  }

  return new paper.Point(center.x + projectedX, center.y + projectedY);
}

function createElipse(
  radius: number,
  center: paper.Point,
  perspectiveFactorX: number,
  perspectiveFactorY: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  dash: number,
  group: paper.Group,
) {
  const path = new paper.Path.Ellipse({
    center: center,
    size: [radius * 2 * perspectiveFactorX, radius * 2 * perspectiveFactorY], // Making Y-axis shorter
    strokeColor,
    strokeWidth,
  });
  path.dashOffset = dash;
  path.dashArray = [dash, dash];
  group.addChild(path);
  return path;
}

function createStar(
  position: paper.Point,
  radius: number,
  color: paper.Color,
  group: paper.Group,
) {
  const star = new paper.Path.Circle(position, radius);
  star.fillColor = color;
  group.addChild(star);
}

export function hypatia(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  settings: SketchSettings & HypatiaSettings,
) {
  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  if (settings.form.outline) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    form.addChild(path);
  }

  const motionColor = new paper.Color(1, 1, 1, settings.form.motion.color);
  const planetColor = new paper.Color(1, 1, 1, settings.form.planets.color);

  if (settings.form.stars.visible) {
    for (let i = 0; i < settings.form.stars.total; i++) {
      const theta = mathSeeded.random() * TWO_PI; // Full azimuthal range
      const phi = Math.acos(2 * mathSeeded.random() - 1); // Uniform sphere sampling
      const point2D = projectSphericalTo2D(theta, phi, radius, center);
      const starColor = new paper.Color(
        1,
        1,
        1,
        mathSeeded.random() > 0.9 ? 1 : mathSeeded.randFloat(0.15, 0.75),
      );
      createStar(point2D, radius * settings.form.stars.radius, starColor, form);
    }
  }

  const SM_AXIS_RATIO = 1 / Math.sqrt(3); // ~0.577

  if (settings.form.motion.visible) {
    const dash = radius * settings.form.motion.dash;
    createElipse(
      radius,
      center,
      1,
      SM_AXIS_RATIO,
      motionColor,
      settings.strokeWidth,
      dash,
      form,
    );
    createElipse(
      radius,
      center,
      SM_AXIS_RATIO,
      1,
      motionColor,
      settings.strokeWidth,
      dash,
      form,
    );
    const l = createElipse(
      radius,
      center,
      SM_AXIS_RATIO,
      1,
      motionColor,
      settings.strokeWidth,
      dash,
      form,
    );
    l.rotate(45);
    const r = createElipse(
      radius,
      center,
      SM_AXIS_RATIO,
      1,
      motionColor,
      settings.strokeWidth,
      dash,
      form,
    );
    r.rotate(-45);
  }

  const total = 7;
  const hypatiaRadius = radius * settings.form.hypatia.radius;
  const minRadius = radius / 5;
  const maxRadius = radius * 1;

  if (settings.form.hypatia.visible) {
    const path = new paper.Path.Circle(center, hypatiaRadius);
    path.fillColor = settings.strokeColor;
    form.addChild(path);
  }

  if (settings.form.orbit.visible) {
    for (let i = 0; i < total; i++) {
      const p = i / (total - 1);
      const r = MathUtils.lerp(minRadius, maxRadius, p);

      const perspectiveFactorY = MathUtils.lerp(
        SM_AXIS_RATIO,
        SM_AXIS_RATIO * (1 + SM_AXIS_RATIO),
        p,
      );
      const perspectiveFactorX = 1; // Major axis remains 1

      const path = new paper.Path.Ellipse({
        center: center,
        size: [r * 2 * perspectiveFactorX, r * 2 * perspectiveFactorY],
        strokeColor: settings.strokeColor,
        strokeWidth: settings.strokeWidth,
      });

      path.strokeColor = planetColor;
      path.strokeWidth = settings.strokeWidth;

      const dash = radius * settings.form.motion.dash;
      path.dashOffset = dash;
      path.dashArray = [dash, dash];

      form.addChild(path);

      if (settings.form.planets.visible) {
        const theta = MathUtils.lerp(
          0,
          TWO_PI * settings.form.planets.spiral,
          p,
        );
        createCircle(
          new paper.Point(
            center.x + Math.cos(theta) * r * perspectiveFactorX,
            center.y + Math.sin(theta) * r * perspectiveFactorY,
          ),
          radius * settings.form.planets.radius,
          undefined,
          undefined,
          settings.strokeColor,
          form,
        );
      }
    }
  }
}
