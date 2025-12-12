// Three.js Flow/CurveModifier implementation
// Based on: https://github.com/mrdoob/three.js/blob/dev/examples/jsm/modifiers/CurveModifier.js

import {
  CatmullRomCurve3,
  DataTexture,
  DataUtils,
  HalfFloatType,
  LinearFilter,
  Mesh,
  RepeatWrapping,
  RGBAFormat,
  Vector3,
} from "three";

const CHANNELS = 4;
const TEXTURE_WIDTH = 1024;
const TEXTURE_HEIGHT = 4;

function initSplineTexture(numberOfCurves = 1) {
  const dataArray = new Uint16Array(
    TEXTURE_WIDTH * TEXTURE_HEIGHT * numberOfCurves * CHANNELS,
  );
  const dataTexture = new DataTexture(
    dataArray,
    TEXTURE_WIDTH,
    TEXTURE_HEIGHT * numberOfCurves,
    RGBAFormat,
    HalfFloatType,
  );

  dataTexture.wrapS = RepeatWrapping;
  dataTexture.wrapT = RepeatWrapping;
  dataTexture.magFilter = LinearFilter;
  dataTexture.minFilter = LinearFilter;
  dataTexture.needsUpdate = true;

  return dataTexture;
}

function updateSplineTexture(
  texture: DataTexture,
  splineCurve: CatmullRomCurve3,
  offset = 0,
) {
  const numberOfPoints = Math.floor(TEXTURE_WIDTH * (TEXTURE_HEIGHT / 4));

  // Ensure the curve has proper arc length divisions
  splineCurve.arcLengthDivisions = numberOfPoints / 2;
  splineCurve.updateArcLengths();

  const points = splineCurve.getSpacedPoints(numberOfPoints);
  const frenetFrames = splineCurve.computeFrenetFrames(numberOfPoints, true);

  for (let i = 0; i < numberOfPoints; i++) {
    const rowOffset = Math.floor(i / TEXTURE_WIDTH);
    const rowIndex = i % TEXTURE_WIDTH;

    let pt = points[i];
    setTextureValue(
      texture,
      rowIndex,
      pt.x,
      pt.y,
      pt.z,
      0 + rowOffset + TEXTURE_HEIGHT * offset,
    );

    pt = frenetFrames.tangents[i];
    setTextureValue(
      texture,
      rowIndex,
      pt.x,
      pt.y,
      pt.z,
      1 + rowOffset + TEXTURE_HEIGHT * offset,
    );

    pt = frenetFrames.normals[i];
    setTextureValue(
      texture,
      rowIndex,
      pt.x,
      pt.y,
      pt.z,
      2 + rowOffset + TEXTURE_HEIGHT * offset,
    );

    pt = frenetFrames.binormals[i];
    setTextureValue(
      texture,
      rowIndex,
      pt.x,
      pt.y,
      pt.z,
      3 + rowOffset + TEXTURE_HEIGHT * offset,
    );
  }

  texture.needsUpdate = true;
}

function setTextureValue(
  texture: DataTexture,
  index: number,
  x: number,
  y: number,
  z: number,
  o: number,
) {
  const image = texture.image;
  const data = image.data as Uint16Array;
  const i = CHANNELS * TEXTURE_WIDTH * o;
  data[index * CHANNELS + i + 0] = DataUtils.toHalfFloat(x);
  data[index * CHANNELS + i + 1] = DataUtils.toHalfFloat(y);
  data[index * CHANNELS + i + 2] = DataUtils.toHalfFloat(z);
  data[index * CHANNELS + i + 3] = DataUtils.toHalfFloat(1);
}

function getUniforms(splineTexture: DataTexture) {
  return {
    spineTexture: { value: splineTexture },
    pathOffset: { type: "f", value: 0 },
    pathSegment: { type: "f", value: 1 },
    spineOffset: { type: "f", value: 161 },
    spineLength: { type: "f", value: 400 },
    flow: { type: "i", value: 1 },
  };
}

function modifyShader(material: any, uniforms: any, numberOfCurves = 1) {
  if (material.__flowModified) return;
  material.__flowModified = true;

  material.onBeforeCompile = (shader: any) => {
    if (shader.__flowCompiled) return;
    shader.__flowCompiled = true;

    Object.assign(shader.uniforms, uniforms);

    const vertexShader = `
uniform sampler2D spineTexture;
uniform float pathOffset;
uniform float pathSegment;
uniform float spineOffset;
uniform float spineLength;
uniform int flow;

float textureLayers = ${TEXTURE_HEIGHT * numberOfCurves}.;
float textureStacks = ${TEXTURE_HEIGHT / 4}.;

${shader.vertexShader}`
      .replace("#include <beginnormal_vertex>", "")
      .replace("#include <defaultnormal_vertex>", "")
      .replace("#include <begin_vertex>", "")
      .replace(
        /void\s*main\s*\(\)\s*\{/,
        `
void main() {
#include <beginnormal_vertex>

vec4 worldPos = modelMatrix * vec4(position, 1.0);
bool bend = flow > 0;
float xWeight = bend ? 0.0 : 1.0;

float spinePortion = bend ? (worldPos.x + spineOffset) / spineLength : 0.0;
float mt = (spinePortion * pathSegment + pathOffset) * textureStacks;

mt = mod(mt, textureStacks);
float rowOffset = floor(mt);

vec3 spinePos = texture2D(spineTexture, vec2(mt, (0.0 + rowOffset + 0.5) / textureLayers)).xyz;
vec3 a = texture2D(spineTexture, vec2(mt, (1.0 + rowOffset + 0.5) / textureLayers)).xyz;
vec3 b = texture2D(spineTexture, vec2(mt, (2.0 + rowOffset + 0.5) / textureLayers)).xyz;
vec3 c = texture2D(spineTexture, vec2(mt, (3.0 + rowOffset + 0.5) / textureLayers)).xyz;
mat3 basis = mat3(a, b, c);

vec3 transformed = basis * vec3(worldPos.x * xWeight, worldPos.y, worldPos.z) + spinePos;
vec3 transformedNormal = normalMatrix * (basis * objectNormal);
`,
      )
      .replace(
        "#include <project_vertex>",
        `vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
gl_Position = projectionMatrix * mvPosition;`,
      );

    shader.vertexShader = vertexShader;
  };
}

export class Flow {
  object3D: Mesh;
  splineTexture: DataTexture;
  uniforms: any;
  curveArray: Array<CatmullRomCurve3 | undefined>;
  curveLengthArray: Array<number>;

  constructor(mesh: Mesh, numberOfCurves = 1) {
    const obj3D = mesh.clone();
    const splineTexture = initSplineTexture(numberOfCurves);
    const uniforms = getUniforms(splineTexture);

    // Modify the material to use the flow shader
    if (Array.isArray(obj3D.material)) {
      const materials = [];
      for (const material of obj3D.material) {
        const newMaterial = material.clone();
        modifyShader(newMaterial, uniforms, numberOfCurves);
        materials.push(newMaterial);
      }
      obj3D.material = materials;
    } else {
      obj3D.material = obj3D.material.clone();
      modifyShader(obj3D.material, uniforms, numberOfCurves);
    }

    this.curveArray = new Array(numberOfCurves);
    this.curveLengthArray = new Array(numberOfCurves);
    this.object3D = obj3D;
    this.splineTexture = splineTexture;
    this.uniforms = uniforms;
  }

  updateCurve(index: number, curve: CatmullRomCurve3) {
    if (index >= this.curveArray.length) {
      throw new Error("Flow: Index out of range.");
    }

    const curveLength = curve.getLength();
    this.uniforms.spineLength.value = curveLength;
    this.curveLengthArray[index] = curveLength;
    this.curveArray[index] = curve;
    updateSplineTexture(this.splineTexture, curve, index);
  }

  moveAlongCurve(amount: number) {
    this.uniforms.pathOffset.value += amount;
  }
}
