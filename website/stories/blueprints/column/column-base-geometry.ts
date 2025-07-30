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
      middleTorus: {
        visible: boolean;
        height: number;
        radius: number;
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
  createPlinth(center, currentY, radius, settings.form.layers.plinth, settings.form.opacity, form);
  
  if (settings.form.layers.plinth.visible) {
    currentY -= radius * settings.form.layers.plinth.height;
  }
  
  createTorus(center, currentY, radius, settings.form.layers.lowerTorus, settings.form.opacity, settings.form.debug, form);

  if (settings.form.layers.lowerTorus.visible) {
    currentY -= radius * settings.form.layers.lowerTorus.height;
  }

  createFillet(center, currentY, radius, settings.form.layers.fillet, settings.form.opacity, form);

  if (settings.form.layers.fillet.visible) {
    currentY -= radius * settings.form.layers.fillet.height;
  }

  // Draw revolution lines to show 3D form
  if (settings.form.layers.plinth.visible || settings.form.layers.lowerTorus.visible || settings.form.layers.fillet.visible) {
    drawRevolutionLines(
      center, 
      radius, 
      settings.form.layers, 
      settings.form.opacity, 
      new paper.Color(1, 1, 1), 
      form
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
  form: paper.Group,
) {
  if (!plinthSettings.visible) return;

  const plinthWidth = columnRadius * plinthSettings.width;
  const plinthHeight = columnRadius * plinthSettings.height;
  const startXOffset = columnRadius * plinthSettings.startX; // Convert relative to absolute

  // Define key points
  const bottomLeft = new paper.Point(center.x, bottomY);
  const bottomRight = new paper.Point(center.x + plinthWidth + startXOffset, bottomY);
  const topRight = new paper.Point(center.x + plinthWidth + startXOffset, bottomY - plinthHeight);
  const topCenter = new paper.Point(center.x, bottomY - plinthHeight);

  // Bottom edge line
  const bottomLine = new paper.Path.Line(bottomLeft, bottomRight);
  bottomLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  bottomLine.strokeWidth = 2;
  form.addChild(bottomLine);

  // Right edge line (vertical)
  const rightLine = new paper.Path.Line(bottomRight, topRight);
  rightLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  rightLine.strokeWidth = 2;
  form.addChild(rightLine);

  // Top edge line (back to center)
  const topLine = new paper.Path.Line(topRight, topCenter);
  topLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  topLine.strokeWidth = 2;
  form.addChild(topLine);
}

/**
 * Creates a separate torus shape
 */
function createTorus(
  center: paper.Point,
  startY: number,
  columnRadius: number,
  torusSettings: ColumnBaseSettings["form"]["layers"]["lowerTorus"],
  opacity: number,
  debug: boolean,
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
  const startPoint = new paper.Point(center.x + columnRadius + startXOffset, startY);
  torusProfile.push(startPoint);
  
  // Create semicircle bulging outward from the start position
  for (let i = 1; i < segments; i++) {
    const t = i / (segments - 1); // 0 to 1
    const angle = t * Math.PI; // 0 to PI (semicircle)
    
    // Semicircle centered at the start position, bulging outward
    const x = center.x + columnRadius + startXOffset + (torusRadius * Math.sin(angle));
    const y = startY - (torusHeight * 0.5) + (torusHeight * 0.5 * Math.cos(angle));
    
    torusProfile.push(new paper.Point(x, y));
  }
  
  // End back at start position, bottom of torus
  const endPoint = new paper.Point(center.x + columnRadius + startXOffset, startY - torusHeight);
  torusProfile.push(endPoint);

  // Create the torus path
  const torusPath = new paper.Path({
    segments: torusProfile,
    strokeColor: new paper.Color(1, 1, 1, opacity),
    strokeWidth: 2,
    fillColor: null,
  });
  form.addChild(torusPath);

  // Add connecting lines back to origin x position (separate white lines)
  // Top connecting line - back to column center
  const topConnectionLine = new paper.Path.Line(
    startPoint,
    new paper.Point(center.x, startY)
  );
  topConnectionLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  topConnectionLine.strokeWidth = 2;
  form.addChild(topConnectionLine);
  
  // Bottom connecting line - back to column center
  const bottomConnectionLine = new paper.Path.Line(
    endPoint,
    new paper.Point(center.x, startY - torusHeight)
  );
  bottomConnectionLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  bottomConnectionLine.strokeWidth = 2;
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
  filletSettings: ColumnBaseSettings["form"]["layers"]["fillet"],
  opacity: number,
  form: paper.Group,
) {
  if (!filletSettings.visible) return;

  const filletHeight = columnRadius * filletSettings.height;
  const startXOffset = columnRadius * filletSettings.startX;

  // Define key points (similar to plinth structure)
  const topLeft = new paper.Point(center.x, startY);
  const topRight = new paper.Point(center.x + columnRadius + startXOffset, startY);
  const bottomRight = new paper.Point(center.x + columnRadius + startXOffset, startY - filletHeight);
  const bottomCenter = new paper.Point(center.x, startY - filletHeight);

  // Top edge line
  const topLine = new paper.Path.Line(topLeft, topRight);
  topLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  topLine.strokeWidth = 2;
  form.addChild(topLine);

  // Right edge line (vertical) - only if there's meaningful height
  if (filletHeight > 0.01) {
    const rightLine = new paper.Path.Line(topRight, bottomRight);
    rightLine.strokeColor = new paper.Color(1, 1, 1, opacity);
    rightLine.strokeWidth = 2;
    form.addChild(rightLine);
  }

  // Bottom edge line (back to center)
  const bottomLine = new paper.Path.Line(bottomRight, bottomCenter);
  bottomLine.strokeColor = new paper.Color(1, 1, 1, opacity);
  bottomLine.strokeWidth = 2;
  form.addChild(bottomLine);
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
      new paper.Point(center.x + plinthWidth, currentY)
    );
    bottomLine.strokeColor = lineColor;
    bottomLine.strokeWidth = 0.5;
    form.addChild(bottomLine);
    
    // Top line at column radius (only right side from center)
    const topLine = new paper.Path.Line(
      new paper.Point(center.x, currentY - plinthHeight),
      new paper.Point(center.x + columnRadius, currentY - plinthHeight)
    );
    topLine.strokeColor = lineColor;
    topLine.strokeWidth = 0.5;
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
      const y = currentY - (torusHeight * t);
      const radius = columnRadius + (torusRadius * Math.sin(t * Math.PI));
      
      const line = new paper.Path.Line(
        new paper.Point(center.x, y),
        new paper.Point(center.x + radius, y)
      );
      line.strokeColor = lineColor;
      line.strokeWidth = 0.3;
      form.addChild(line);
    }
    
    currentY -= torusHeight;
  }
  
  // Draw vertical center line
  const centerLine = new paper.Path.Line(
    new paper.Point(center.x, center.y + columnRadius * 0.8),
    new paper.Point(center.x, currentY)
  );
  centerLine.strokeColor = new paper.Color(1, 1, 1, opacity * 0.5);
  centerLine.strokeWidth = 1;
  centerLine.dashArray = [2, 2];
  form.addChild(centerLine);
}
