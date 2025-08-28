import {
  Color,
  Float32BufferAttribute,
  IcosahedronGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  TetrahedronGeometry,
  Vector3,
} from "three";

import { GUIType } from "@utils/editor/gui/gui-types";
import WebGLApp, { GUIWebGLApp } from "../webgl-app";

export default class PlatonicSketch extends WebGLApp {
  create() {
    // Create an icosahedron geometry (non-indexed by default)
    const geometry = new TetrahedronGeometry(1);
    // Rotate around the X-axis to make it flat on the XZ plane
    // const angleX = Math.acos(-1 / 3); // Approximately 109.47 degrees
    geometry.rotateZ(MathUtils.degToRad(-45));
    geometry.rotateX(Math.acos(-1 / Math.sqrt(3)));
    geometry.computeVertexNormals();

    // Prepare face colors (20 faces for an icosahedron)
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
      0xff8800, // Face 12: Orange
      0xff0088, // Face 13: Pink
      0x88ff00, // Face 14: Lime
      0x0088ff, // Face 15: Light Blue
      0x8800ff, // Face 16: Purple
      0x8888ff, // Face 17: Lavender
      0xff8888, // Face 18: Light Red
      0x88ffff, // Face 19: Light Cyan
    ];

    // Add vertex colors for the geometry
    const colors = [];
    const color = new Color();

    // Each face is a triangle with 3 vertices
    const verticesPerFace = 3; // 1 triangle x 3 vertices
    const totalFaces = 4; // Icosahedron has 20 faces

    for (let faceIndex = 0; faceIndex < totalFaces; faceIndex++) {
      // Set the color for this face
      color.setHex(faceColors[faceIndex % faceColors.length]);

      // Assign this color to all 3 vertices of the face
      for (let i = 0; i < verticesPerFace; i++) {
        colors.push(color.r, color.g, color.b);
      }
    }

    // Add the colors as a vertex attribute
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

    // Log the normals and positions of each face for debugging
    const positions = geometry.attributes.position;
    const normals = geometry.attributes.normal;

    for (let faceIndex = 0; faceIndex < totalFaces; faceIndex++) {
      console.log(`Face ${faceIndex}:`);

      // Get the normal vector for the first vertex of the face
      const normal = new Vector3(
        normals.getX(faceIndex * verticesPerFace),
        normals.getY(faceIndex * verticesPerFace),
        normals.getZ(faceIndex * verticesPerFace),
      );
      console.log(`  Normal:`, normal);

      // Get the vertex positions for this face
      for (let i = 0; i < verticesPerFace; i++) {
        const vertex = new Vector3(
          positions.getX(faceIndex * verticesPerFace + i),
          positions.getY(faceIndex * verticesPerFace + i),
          positions.getZ(faceIndex * verticesPerFace + i),
        );
        console.log(`  Vertex ${i}:`, vertex);
      }
    }

    // Create the material and mesh
    const material = new MeshBasicMaterial({
      vertexColors: true,
      wireframe: false,
    });
    const icosahedron = new Mesh(geometry, material);
    this.scene.add(icosahedron);
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
