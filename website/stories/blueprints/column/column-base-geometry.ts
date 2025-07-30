import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import {
  createCircle,
  createLine,
  createPointOnCircle,
  lerp,
} from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type ColumnBaseSettings = {
  blueprint: {};
  form: {
    visible: boolean;
    opacity: number;
    layers: {
      plinth: {
        visible: boolean;
        height: number;
        width: number;
        startX: number; // Starting x position relative to column radius
      };
      lowerTorus: {
        visible: boolean;
        height: number;
        radius: number;
        startX: number; // Starting x position relative to column radius (0 = at column edge, negative = inward, positive = outward)
      };
      fillet: {
        visible: boolean;
        height: number;
        startX: number; // Thin separating band between layers
      };
      scotia: {
        visible: boolean;
        height: number;
        depth: number; // How deep the concave curve goes (inward from column)
        startX: number;
      };
      upperFillet: {
        visible: boolean;
        height: number;
        startX: number; // Thin separating band above scotia
      };
      middleTorus: {
        visible: boolean;
        height: number;
        radius: number;
        startX: number;
      };
      secondUpperFillet: {
        visible: boolean;
        height: number;
        startX: number; // Thin separating band above middle torus
      };
      cymaReversa: {
        visible: boolean;
        height: number;
        depth: number; // How deep the S-curve extends inward/outward
        startX: number;
      };
      upperTorus: {
        visible: boolean;
        height: number;
        radius: number;
        startX: number;
      };
      shaftTorus: {
        visible: boolean;
        height: number;
        radius: number;
        startX: number;
      };
    };
    debug: boolean;
  };
  grid: {
    visible: boolean;
    opacity: number;
    divisions: number;
  };
};

/**
 * Creates a classical column base profile following traditional proportions.
 * The base consists of multiple moldings stacked vertically:
 * - Plinth (bottom rectangular base)
 * - Main torus (convex molding)
 * - Scotia (concave molding)
 * - Upper torus (smaller convex molding)
 */
export function columnBase(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  viewSize: paper.Size,
  radius: number,
  settings: SketchSettings & ColumnBaseSettings,
) {
  if (!settings.form.visible) return;

  let currentY = center.y + radius * 0.8; // Start at bottom of view
  let currentRadius = radius;

  // Create each element as a separate shape
  createPlinth(
    center,
    currentY,
    radius,
    settings.form.layers.plinth,
    settings.form.opacity,
    settings,
    form,
  );

  if (settings.form.layers.plinth.visible) {
    currentY -= radius * settings.form.layers.plinth.height;
  }

  createTorus(
    center,
    currentY,
    radius,
    settings.form.layers.lowerTorus,
    settings.form.opacity,
    settings.form.debug,
    settings,
    form,
  );

  if (settings.form.layers.lowerTorus.visible) {
    currentY -= radius * settings.form.layers.lowerTorus.height;
  }

  createFillet(
    center,
    currentY,
    radius,
    settings.form.layers.fillet,
    settings.form.opacity,
    settings,
    form,
  );

  if (settings.form.layers.fillet.visible) {
    currentY -= radius * settings.form.layers.fillet.height;
  }

  createScotia(
    center,
    currentY,
    radius,
    settings.form.layers.scotia,
    settings.form.opacity,
    settings.form.debug,
    settings,
    form,
  );

  if (settings.form.layers.scotia.visible) {
    currentY -= radius * settings.form.layers.scotia.height;
  }

  createFillet(
    center,
    currentY,
    radius,
    settings.form.layers.upperFillet,
    settings.form.opacity,
    settings,
    form,
  );

  if (settings.form.layers.upperFillet.visible) {
    currentY -= radius * settings.form.layers.upperFillet.height;
  }

  createTorus(
    center,
    currentY,
    radius,
    settings.form.layers.middleTorus,
    settings.form.opacity,
    settings.form.debug,
    settings,
    form,
  );

  if (settings.form.layers.middleTorus.visible) {
    currentY -= radius * settings.form.layers.middleTorus.height;
  }

  createFillet(
    center,
    currentY,
    radius,
    settings.form.layers.secondUpperFillet,
    settings.form.opacity,
    settings,
    form,
  );

  if (settings.form.layers.secondUpperFillet.visible) {
    currentY -= radius * settings.form.layers.secondUpperFillet.height;
  }

  createCymaReversa(
    center,
    currentY,
    radius,
    settings.form.layers.cymaReversa,
    settings.form.opacity,
    settings.form.debug,
    settings,
    form,
  );

  if (settings.form.layers.cymaReversa.visible) {
    currentY -= radius * settings.form.layers.cymaReversa.height;
  }

  // Draw revolution lines to show 3D form
  if (
    settings.form.layers.plinth.visible ||
    settings.form.layers.lowerTorus.visible ||
    settings.form.layers.fillet.visible ||
    settings.form.layers.scotia.visible ||
    settings.form.layers.upperFillet.visible ||
    settings.form.layers.middleTorus.visible ||
    settings.form.layers.secondUpperFillet.visible ||
    settings.form.layers.cymaReversa.visible
  ) {
    drawRevolutionLines(
      center,
      radius,
      settings.form.layers,
      settings.form.opacity,
      new paper.Color(1, 1, 1),
      settings,
      form,
    );
  }
}

/**
 * Creates a separate plinth shape
 */
function createPlinth(
  center: paper.Point,
  bottomY: number,
  columnRadius: number,
  plinthSettings: ColumnBaseSettings["form"]["layers"]["plinth"],
  opacity: number,
  settings: SketchSettings & ColumnBaseSettings,
  form: paper.Group,
) {
  if (!plinthSettings.visible) return;

  const plinthWidth = columnRadius * plinthSettings.width;
  const plinthHeight = columnRadius * plinthSettings.height;
  const startXOffset = columnRadius * plinthSettings.startX; // Convert relative to absolute

  // Define key points
  const bottomLeft = new paper.Point(center.x, bottomY);
  const bottomRight = new paper.Point(
    center.x + plinthWidth + startXOffset,
    bottomY,
  );
  const topRight = new paper.Point(
    center.x + plinthWidth + startXOffset,
    bottomY - plinthHeight,
  );
  const topCenter = new paper.Point(center.x, bottomY - plinthHeight);

  // Bottom edge line
  const bottomLine = new paper.Path.Line(bottomLeft, bottomRight);
  bottomLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  bottomLine.strokeWidth = settings.strokeWidth;
  form.addChild(bottomLine);

  // Right edge line (vertical)
  const rightLine = new paper.Path.Line(bottomRight, topRight);
  rightLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  rightLine.strokeWidth = settings.strokeWidth;
  form.addChild(rightLine);

  // Top edge line (back to center)
  const topLine = new paper.Path.Line(topRight, topCenter);
  topLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  topLine.strokeWidth = settings.strokeWidth;
  form.addChild(topLine);
}

/**
 * Creates a separate torus shape
 */
function createTorus(
  center: paper.Point,
  startY: number,
  columnRadius: number,
  torusSettings:
    | ColumnBaseSettings["form"]["layers"]["lowerTorus"]
    | ColumnBaseSettings["form"]["layers"]["middleTorus"]
    | ColumnBaseSettings["form"]["layers"]["upperTorus"]
    | ColumnBaseSettings["form"]["layers"]["shaftTorus"],
  opacity: number,
  debug: boolean,
  settings: SketchSettings & ColumnBaseSettings,
  form: paper.Group,
) {
  if (!torusSettings.visible) return;

  const torusHeight = columnRadius * torusSettings.height;
  const torusRadius = columnRadius * torusSettings.radius;
  const startXOffset = columnRadius * torusSettings.startX; // Convert relative to absolute

  // Create semicircular profile that bulges outward along x-axis
  const torusProfile: paper.Point[] = [];
  const segments = 12; // More segments for smoother curve

  // Start at column radius + startX offset, top of torus
  const startPoint = new paper.Point(
    center.x + columnRadius + startXOffset,
    startY,
  );
  torusProfile.push(startPoint);

  // Create semicircle bulging outward from the start position
  for (let i = 1; i < segments; i++) {
    const t = i / (segments - 1); // 0 to 1
    const angle = t * Math.PI; // 0 to PI (semicircle)

    // Semicircle centered at the start position, bulging outward
    const x =
      center.x + columnRadius + startXOffset + torusRadius * Math.sin(angle);
    const y = startY - torusHeight * 0.5 + torusHeight * 0.5 * Math.cos(angle);

    torusProfile.push(new paper.Point(x, y));
  }

  // End back at start position, bottom of torus
  const endPoint = new paper.Point(
    center.x + columnRadius + startXOffset,
    startY - torusHeight,
  );
  torusProfile.push(endPoint);

  // Create the torus path
  const torusPath = new paper.Path({
    segments: torusProfile,
    strokeColor: new paper.Color(1, 1, 1, opacity),
    strokeWidth: settings.strokeWidth,
    fillColor: null,
  });
  form.addChild(torusPath);

  // Add connecting lines back to origin x position (separate white lines)
  // Top connecting line - back to column center
  const topConnectionLine = new paper.Path.Line(
    startPoint,
    new paper.Point(center.x, startY),
  );
  topConnectionLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  topConnectionLine.strokeWidth = settings.strokeWidth;
  form.addChild(topConnectionLine);

  // Bottom connecting line - back to column center
  const bottomConnectionLine = new paper.Path.Line(
    endPoint,
    new paper.Point(center.x, startY - torusHeight),
  );
  bottomConnectionLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  bottomConnectionLine.strokeWidth = settings.strokeWidth;
  form.addChild(bottomConnectionLine);

  // Debug points
  if (debug) {
    torusProfile.forEach((point, index) => {
      createCircle(point, 2, new paper.Color(1, 0, 0), 1, undefined, form);

      // Add labels for key points
      if (index % 3 === 0) {
        const text = new paper.PointText({
          point: point.add(new paper.Point(5, 0)),
          content: `${index}`,
          fillColor: new paper.Color(1, 1, 0),
          fontSize: 8,
        });
        form.addChild(text);
      }
    });
  }
}

/**
 * Creates a separate fillet (thin separating band) shape
 */
function createFillet(
  center: paper.Point,
  startY: number,
  columnRadius: number,
  filletSettings:
    | ColumnBaseSettings["form"]["layers"]["fillet"]
    | ColumnBaseSettings["form"]["layers"]["upperFillet"]
    | ColumnBaseSettings["form"]["layers"]["secondUpperFillet"],
  opacity: number,
  settings: SketchSettings & ColumnBaseSettings,
  form: paper.Group,
) {
  if (!filletSettings.visible) return;

  const filletHeight = columnRadius * filletSettings.height;
  const startXOffset = columnRadius * filletSettings.startX;

  // Define key points (similar to plinth structure)
  const topLeft = new paper.Point(center.x, startY);
  const topRight = new paper.Point(
    center.x + columnRadius + startXOffset,
    startY,
  );
  const bottomRight = new paper.Point(
    center.x + columnRadius + startXOffset,
    startY - filletHeight,
  );
  const bottomCenter = new paper.Point(center.x, startY - filletHeight);

  // Top edge line
  const topLine = new paper.Path.Line(topLeft, topRight);
  topLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  topLine.strokeWidth = settings.strokeWidth;
  form.addChild(topLine);

  // Right edge line (vertical) - only if there's meaningful height
  if (filletHeight > 0.01) {
    const rightLine = new paper.Path.Line(topRight, bottomRight);
    rightLine.strokeColor = new paper.Color(1, 1, 1, opacity);
    rightLine.strokeWidth = settings.strokeWidth;
    form.addChild(rightLine);
  }

  // Bottom edge line (back to center)
  const bottomLine = new paper.Path.Line(bottomRight, bottomCenter);
  bottomLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  bottomLine.strokeWidth = settings.strokeWidth;
  form.addChild(bottomLine);
}

/**
 * Creates a separate scotia (concave molding) shape
 */
function createScotia(
  center: paper.Point,
  startY: number,
  columnRadius: number,
  scotiaSettings: ColumnBaseSettings["form"]["layers"]["scotia"],
  opacity: number,
  debug: boolean,
  settings: SketchSettings & ColumnBaseSettings,
  form: paper.Group,
) {
  if (!scotiaSettings.visible) return;

  const scotiaHeight = columnRadius * scotiaSettings.height;
  const scotiaDepth = columnRadius * scotiaSettings.depth;
  const startXOffset = columnRadius * scotiaSettings.startX;

  // Create concave profile (scotia - curves inward then back out)
  const scotiaProfile: paper.Point[] = [];
  const segments = 16; // More segments for smoother curve

  // Start at column radius + startX offset, top of scotia
  const startPoint = new paper.Point(
    center.x + columnRadius + startXOffset,
    startY,
  );
  scotiaProfile.push(startPoint);

  // Create scotia curve: starts vertical, curves inward, then back out to vertical
  // This creates the characteristic concave profile
  for (let i = 1; i < segments; i++) {
    const t = i / segments; // 0 to 1

    // Use a quarter circle that starts vertical and ends vertical
    // Center the quarter circle so it creates proper concave shape
    const angle = t * Math.PI; // 0 to PI (semicircle)

    // Scotia profile: starts at column edge, dips inward, returns to column edge
    const x =
      center.x + columnRadius + startXOffset - scotiaDepth * Math.sin(angle);
    const y = startY - scotiaHeight * t;

    scotiaProfile.push(new paper.Point(x, y));
  }

  // End at column radius + startX offset, bottom of scotia
  const endPoint = new paper.Point(
    center.x + columnRadius + startXOffset,
    startY - scotiaHeight,
  );
  scotiaProfile.push(endPoint);

  // Create the scotia path
  const scotiaPath = new paper.Path({
    segments: scotiaProfile,
    strokeColor: new paper.Color(1, 1, 1, opacity),
    strokeWidth: settings.strokeWidth,
    fillColor: null,
  });
  form.addChild(scotiaPath);

  // Add connecting lines back to origin x position (separate white lines)
  // Top connecting line - back to column center
  const topConnectionLine = new paper.Path.Line(
    startPoint,
    new paper.Point(center.x, startY),
  );
  topConnectionLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  topConnectionLine.strokeWidth = settings.strokeWidth;
  form.addChild(topConnectionLine);

  // Bottom connecting line - back to column center
  const bottomConnectionLine = new paper.Path.Line(
    endPoint,
    new paper.Point(center.x, startY - scotiaHeight),
  );
  bottomConnectionLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  bottomConnectionLine.strokeWidth = settings.strokeWidth;
  form.addChild(bottomConnectionLine);

  // Debug points
  if (debug) {
    scotiaProfile.forEach((point, index) => {
      createCircle(point, 2, new paper.Color(0, 1, 0), 1, undefined, form);

      // Add labels for key points
      if (index % 3 === 0) {
        const text = new paper.PointText({
          point: point.add(new paper.Point(5, 0)),
          content: `${index}`,
          fillColor: new paper.Color(0, 1, 1),
          fontSize: 8,
        });
        form.addChild(text);
      }
    });
  }
}

/**
 * Creates a separate cyma reversa (reverse cyma) shape.
 * This creates an S-shaped curve that starts concave at the bottom and transitions to convex at the top,
 * creating an elegant upward-flowing profile perfect for crowning a column base.
 */
function createCymaReversa(
  center: paper.Point,
  startY: number,
  columnRadius: number,
  cymaSettings: ColumnBaseSettings["form"]["layers"]["cymaReversa"],
  opacity: number,
  debug: boolean,
  settings: SketchSettings & ColumnBaseSettings,
  form: paper.Group,
) {
  if (!cymaSettings.visible) return;

  const cymaHeight = columnRadius * cymaSettings.height;
  const cymaDepth = columnRadius * cymaSettings.depth;
  const startXOffset = columnRadius * cymaSettings.startX;

  // Create inward curve profile - half semicircle (quarter circle)
  const cymaProfile: paper.Point[] = [];
  const segments = 12; // Segments for smooth quarter-circle

  // Start at column radius + startX offset, top of cyma
  const startPoint = new paper.Point(
    center.x + columnRadius + startXOffset,
    startY,
  );
  cymaProfile.push(startPoint);

  // Create quarter-circle curve: starts vertical, curves inward
  // This uses half of what scotia does (quarter circle instead of semicircle)
  for (let i = 1; i < segments; i++) {
    const t = i / segments; // 0 to 1

    // Use quarter circle (half of scotia's semicircle)
    const angle = t * (Math.PI / 2); // 0 to PI/2 (quarter circle)

    // Quarter-circle profile: starts at column edge, curves inward
    const x =
      center.x + columnRadius + startXOffset - cymaDepth * Math.sin(angle);
    const y = startY - cymaHeight * t;

    cymaProfile.push(new paper.Point(x, y));
  }

  // End at column radius + startX offset - depth (inward), bottom of cyma
  const endPoint = new paper.Point(
    center.x + columnRadius + startXOffset - cymaDepth,
    startY - cymaHeight,
  );
  cymaProfile.push(endPoint);

  // Create the cyma path
  const cymaPath = new paper.Path({
    segments: cymaProfile,
    strokeColor: new paper.Color(1, 1, 1, opacity),
    strokeWidth: settings.strokeWidth,
    fillColor: null,
  });
  form.addChild(cymaPath);

  // Add connecting lines back to origin x position (separate white lines)
  // Top connecting line - back to column center
  const topConnectionLine = new paper.Path.Line(
    startPoint,
    new paper.Point(center.x, startY),
  );
  topConnectionLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  topConnectionLine.strokeWidth = settings.strokeWidth;
  form.addChild(topConnectionLine);

  // Bottom connecting line - back to column center
  const bottomConnectionLine = new paper.Path.Line(
    endPoint,
    new paper.Point(center.x, startY - cymaHeight),
  );
  bottomConnectionLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  bottomConnectionLine.strokeWidth = settings.strokeWidth;
  form.addChild(bottomConnectionLine);

  // Debug points
  if (debug) {
    cymaProfile.forEach((point, index) => {
      createCircle(point, 2, new paper.Color(1, 0, 1), 1, undefined, form);

      // Add labels for key points
      if (index % 4 === 0) {
        const text = new paper.PointText({
          point: point.add(new paper.Point(5, 0)),
          content: `${index}`,
          fillColor: new paper.Color(1, 0, 1),
          fontSize: 8,
        });
        form.addChild(text);
      }
    });
  }
}

/**
 * Creates profile points for a classical torus (convex molding).
 * Simple quarter circle that bulges outward from the starting point.
 */
function createClassicalTorusProfile(
  startPoint: paper.Point,
  radius: number,
  height: number,
  segments: number,
): paper.Point[] {
  const profile: paper.Point[] = [];

  // Create a quarter circle centered at (startPoint.x + radius, startPoint.y - radius)
  const centerX = startPoint.x + radius;
  const centerY = startPoint.y - radius;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Quarter circle from 180° to 270° (left to bottom)
    const angle = Math.PI + (Math.PI / 2) * t;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    profile.push(new paper.Point(x, y));
  }

  return profile;
}

/**
 * Draws revolution lines to indicate the 3D form of the base.
 * These are horizontal lines that show how the profile would look when revolved.
 */
function drawRevolutionLines(
  center: paper.Point,
  columnRadius: number,
  layers: ColumnBaseSettings["form"]["layers"],
  opacity: number,
  color: paper.Color,
  settings: SketchSettings & ColumnBaseSettings,
  form: paper.Group,
) {
  const lineColor = color.clone();
  lineColor.alpha = opacity * 0.3;

  let currentY = center.y + columnRadius * 0.8; // Start at bottom

  // Draw revolution lines for plinth
  if (layers.plinth.visible) {
    const plinthWidth = columnRadius * layers.plinth.width;
    const plinthHeight = columnRadius * layers.plinth.height;

    // Bottom line at full plinth width (only right side from center)
    const bottomLine = new paper.Path.Line(
      new paper.Point(center.x, currentY),
      new paper.Point(center.x + plinthWidth, currentY),
    );
    bottomLine.strokeColor = lineColor;
    bottomLine.strokeWidth = settings.strokeWidth * 0.25; // Thinner revolution lines
    form.addChild(bottomLine);

    // Top line at column radius (only right side from center)
    const topLine = new paper.Path.Line(
      new paper.Point(center.x, currentY - plinthHeight),
      new paper.Point(center.x + columnRadius, currentY - plinthHeight),
    );
    topLine.strokeColor = lineColor;
    topLine.strokeWidth = settings.strokeWidth * 0.25; // Thinner revolution lines
    form.addChild(topLine);

    currentY -= plinthHeight;
  }

  // Draw revolution lines for lower torus
  if (layers.lowerTorus.visible) {
    const torusHeight = columnRadius * layers.lowerTorus.height;
    const torusRadius = columnRadius * layers.lowerTorus.radius;

    // Draw several horizontal lines to show torus bulge (only right side from center)
    for (let i = 0; i <= 4; i++) {
      const t = i / 4;
      const y = currentY - torusHeight * t;
      const radius = columnRadius + torusRadius * Math.sin(t * Math.PI);

      const line = new paper.Path.Line(
        new paper.Point(center.x, y),
        new paper.Point(center.x + radius, y),
      );
      line.strokeColor = lineColor;
      line.strokeWidth = settings.strokeWidth * 0.15; // Very thin torus revolution lines
      form.addChild(line);
    }

    currentY -= torusHeight;
  }

  // Draw revolution lines for scotia
  if (layers.scotia.visible) {
    const scotiaHeight = columnRadius * layers.scotia.height;
    const scotiaDepth = columnRadius * layers.scotia.depth;

    // Draw several horizontal lines to show scotia concave curve (only right side from center)
    for (let i = 0; i <= 4; i++) {
      const t = i / 4;
      const y = currentY - scotiaHeight * t;
      // Concave curve - starts at column radius, curves inward
      const radius = columnRadius - scotiaDepth * Math.sin(t * Math.PI * 0.5);

      const line = new paper.Path.Line(
        new paper.Point(center.x, y),
        new paper.Point(center.x + radius, y),
      );
      line.strokeColor = lineColor;
      line.strokeWidth = settings.strokeWidth * 0.15; // Very thin scotia revolution lines
      form.addChild(line);
    }

    currentY -= scotiaHeight;
  }

  // Draw revolution lines for upper fillet
  if (layers.upperFillet.visible) {
    const filletHeight = columnRadius * layers.upperFillet.height;
    const startXOffset = columnRadius * layers.upperFillet.startX;

    // Top and bottom lines for the fillet (only right side from center)
    const topLine = new paper.Path.Line(
      new paper.Point(center.x, currentY),
      new paper.Point(center.x + columnRadius + startXOffset, currentY),
    );
    topLine.strokeColor = lineColor;
    topLine.strokeWidth = settings.strokeWidth * 0.25; // Thinner revolution lines
    form.addChild(topLine);

    const bottomLine = new paper.Path.Line(
      new paper.Point(center.x, currentY - filletHeight),
      new paper.Point(
        center.x + columnRadius + startXOffset,
        currentY - filletHeight,
      ),
    );
    bottomLine.strokeColor = lineColor;
    bottomLine.strokeWidth = settings.strokeWidth * 0.25; // Thinner revolution lines
    form.addChild(bottomLine);

    currentY -= filletHeight;
  }

  // Draw revolution lines for middle torus
  if (layers.middleTorus.visible) {
    const torusHeight = columnRadius * layers.middleTorus.height;
    const torusRadius = columnRadius * layers.middleTorus.radius;

    // Draw several horizontal lines to show torus bulge (only right side from center)
    for (let i = 0; i <= 4; i++) {
      const t = i / 4;
      const y = currentY - torusHeight * t;
      const radius = columnRadius + torusRadius * Math.sin(t * Math.PI);

      const line = new paper.Path.Line(
        new paper.Point(center.x, y),
        new paper.Point(center.x + radius, y),
      );
      line.strokeColor = lineColor;
      line.strokeWidth = settings.strokeWidth * 0.15; // Very thin torus revolution lines
      form.addChild(line);
    }

    currentY -= torusHeight;
  }

  // Draw revolution lines for second upper fillet
  if (layers.secondUpperFillet.visible) {
    const filletHeight = columnRadius * layers.secondUpperFillet.height;
    const startXOffset = columnRadius * layers.secondUpperFillet.startX;

    // Top and bottom lines for the fillet (only right side from center)
    const topLine = new paper.Path.Line(
      new paper.Point(center.x, currentY),
      new paper.Point(center.x + columnRadius + startXOffset, currentY),
    );
    topLine.strokeColor = lineColor;
    topLine.strokeWidth = settings.strokeWidth * 0.25; // Thinner revolution lines
    form.addChild(topLine);

    const bottomLine = new paper.Path.Line(
      new paper.Point(center.x, currentY - filletHeight),
      new paper.Point(
        center.x + columnRadius + startXOffset,
        currentY - filletHeight,
      ),
    );
    bottomLine.strokeColor = lineColor;
    bottomLine.strokeWidth = settings.strokeWidth * 0.25; // Thinner revolution lines
    form.addChild(bottomLine);

    currentY -= filletHeight;
  }

  // Draw revolution lines for cyma reversa (quarter-circle inward curve)
  if (layers.cymaReversa.visible) {
    const cymaHeight = columnRadius * layers.cymaReversa.height;
    const cymaDepth = columnRadius * layers.cymaReversa.depth;

    // Draw several horizontal lines to show quarter-circle inward curve (only right side from center)
    for (let i = 0; i <= 4; i++) {
      const t = i / 4;
      const y = currentY - cymaHeight * t;

      // Quarter-circle curve - starts at column radius, curves inward
      const angle = t * (Math.PI / 2); // Quarter circle
      const radius = columnRadius - cymaDepth * Math.sin(angle);

      const line = new paper.Path.Line(
        new paper.Point(center.x, y),
        new paper.Point(center.x + radius, y),
      );
      line.strokeColor = lineColor;
      line.strokeWidth = settings.strokeWidth * 0.15; // Very thin cyma revolution lines
      form.addChild(line);
    }

    currentY -= cymaHeight;
  }

  // Draw vertical center line
  const centerLine = new paper.Path.Line(
    new paper.Point(center.x, center.y + columnRadius * 0.8),
    new paper.Point(center.x, currentY),
  );
  centerLine.strokeColor = new paper.Color(1, 1, 1, opacity * 0.5);
  centerLine.strokeWidth = settings.strokeWidth * 0.5; // Half thickness for center line
  centerLine.dashArray = [2, 2];
  form.addChild(centerLine);
}
