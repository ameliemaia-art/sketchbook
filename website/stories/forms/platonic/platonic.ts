import {
  Color,
  DodecahedronGeometry,
  Float32BufferAttribute,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";

import { GUIType } from "@utils/gui/gui-types";
import WebGLApp, { GUIWebGLApp } from "../webgl-app";

export default class PlatonicSketch extends WebGLApp {
  create() {
    // Create a dodecahedron geometry (non-indexed by default)
    const geometry = new DodecahedronGeometry(1);
    geometry.rotateX(MathUtils.degToRad(-30));
    geometry.computeVertexNormals();

    // Prepare face colors (12 faces for a dodecahedron)
    const faceColors = [
      0xff0000, // Face 0: Red
      0x00ff00, // Face 1: Green
      0x0000ff, // Face 2: Blue
      0xffff00, // Face 3: Yellow
      0xff00ff, // Face 4: Magenta
      0x00ffff, // Face 5: Cyan
      0xffffff, // Face 6: White
      0xaaaaaa, // Face 7: Gray
      0x880000, // Face 8: Dark Red
      0x008800, // Face 9: Dark Green
      0x000088, // Face 10: Dark Blue
      0x888800, // Face 11: Olive
    ];

    // Add vertex colors for the geometry
    const colors = [];
    const color = new Color();

    // Each face has 5 vertices (pentagon) split into 3 triangles (9 vertices per face)
    const verticesPerFace = 9; // 3 vertices x 3 triangles
    for (let faceIndex = 0; faceIndex < 12; faceIndex++) {
      // Set the color for this face
      color.setHex(faceColors[faceIndex]);

      // Assign this color to all 9 vertices of the face
      for (let i = 0; i < verticesPerFace; i++) {
        colors.push(color.r, color.g, color.b);
      }
    }

    // Add the colors as a vertex attribute
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

    // Log the normals and positions of each face for debugging
    const positions = geometry.attributes.position;
    const normals = geometry.attributes.normal;

    for (let faceIndex = 0; faceIndex < 12; faceIndex++) {
      console.log(`Face ${faceIndex}:`);

      // Get the normal vector for the first triangle of the face
      const normal = new Vector3(
        normals.getX(faceIndex * verticesPerFace),
        normals.getY(faceIndex * verticesPerFace),
        normals.getZ(faceIndex * verticesPerFace),
      );
      console.log(`  Normal:`, normal);

      // Get the vertex positions for this face
      for (let i = 0; i < verticesPerFace; i += 3) {
        const vertex = new Vector3(
          positions.getX(faceIndex * verticesPerFace + i),
          positions.getY(faceIndex * verticesPerFace + i),
          positions.getZ(faceIndex * verticesPerFace + i),
        );
        console.log(`  Vertex ${i / 3}:`, vertex);
      }
    }

    // Create the material and mesh
    const material = new MeshBasicMaterial({
      vertexColors: true,
      wireframe: false,
    });
    const dodecahedron = new Mesh(geometry, material);
    this.scene.add(dodecahedron);
  }
}

/// #if DEBUG
export class GUIPlatonicSketch extends GUIWebGLApp {
  constructor(gui: GUIType, target: WebGLApp) {
    super(gui, target);
    this.gui = gui;
  }
}
/// #endif
