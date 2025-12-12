import {
  Curve,
  DataTexture,
  DataUtils,
  DynamicDrawUsage,
  HalfFloatType,
  InstancedMesh,
  LinearFilter,
  Matrix4,
  Mesh,
  RepeatWrapping,
  RGBAFormat,
} from "three";

// Based on: https://github.com/zz85/threejs-path-flow
const CHANNELS = 4;
const TEXTURE_WIDTH = 1024;
const TEXTURE_HEIGHT = 4;

/**
 * Make a new DataTexture to store the descriptions of the curves.
 */
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

/**
 * Write the curve description to the data texture.
 */
function updateSplineTexture(
  texture: DataTexture,
  splineCurve: Curve<any>,
  offset = 0,
) {
  const numberOfPoints = Math.floor(TEXTURE_WIDTH * (TEXTURE_HEIGHT / 4));
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
  const i = CHANNELS * TEXTURE_WIDTH * o; // Row Offset
  data[index * CHANNELS + i + 0] = DataUtils.toHalfFloat(x);
  data[index * CHANNELS + i + 1] = DataUtils.toHalfFloat(y);
  data[index * CHANNELS + i + 2] = DataUtils.toHalfFloat(z);
  data[index * CHANNELS + i + 3] = DataUtils.toHalfFloat(1);
}

/**
 * Create a new set of uniforms for describing the curve modifier.
 */
function getUniforms(splineTexture: DataTexture) {
  const uniforms = {
    spineTexture: { value: splineTexture },
    pathOffset: { type: "f", value: 0 }, // time of path curve
    pathSegment: { type: "f", value: 1 }, // fractional length of path
    spineOffset: { type: "f", value: 161 },
    spineLength: { type: "f", value: 400 },
    flow: { type: "i", value: 1 },
  };
  return uniforms;
}

function modifyShader(material: any, uniforms: any, numberOfCurves = 1) {
  if (material.__ok) return;
  material.__ok = true;

  material.onBeforeCompile = (shader: any) => {
    if (shader.__modified) return;
    shader.__modified = true;

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

		${shader.vertexShader}
		`
      // chunk import moved in front of modified shader below
      .replace("#include <beginnormal_vertex>", "")

      // vec3 transformedNormal declaration overridden below
      .replace("#include <defaultnormal_vertex>", "")

      // vec3 transformed declaration overridden below
      .replace("#include <begin_vertex>", "")

      // shader override
      .replace(
        /void\s*main\s*\(\)\s*\{/,
        `
void main() {
#include <beginnormal_vertex>

vec4 worldPos = modelMatrix * vec4(position, 1.);

bool bend = flow > 0;
float xWeight = bend ? 0. : 1.;

#ifdef USE_INSTANCING
float pathOffsetFromInstanceMatrix = instanceMatrix[3][2];
float spineLengthFromInstanceMatrix = instanceMatrix[3][0];
float spinePortion = bend ? (worldPos.x + spineOffset) / spineLengthFromInstanceMatrix : 0.;
float mt = (spinePortion * pathSegment + pathOffset + pathOffsetFromInstanceMatrix)*textureStacks;
#else
float spinePortion = bend ? (worldPos.x + spineOffset) / spineLength : 0.;
float mt = (spinePortion * pathSegment + pathOffset)*textureStacks;
#endif

mt = mod(mt, textureStacks);
float rowOffset = floor(mt);

#ifdef USE_INSTANCING
rowOffset += instanceMatrix[3][1] * ${TEXTURE_HEIGHT}.;
#endif

vec3 spinePos = texture2D(spineTexture, vec2(mt, (0. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 a =        texture2D(spineTexture, vec2(mt, (1. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 b =        texture2D(spineTexture, vec2(mt, (2. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 c =        texture2D(spineTexture, vec2(mt, (3. + rowOffset + 0.5) / textureLayers)).xyz;
mat3 basis = mat3(a, b, c);

vec3 transformed = basis
	* vec3(worldPos.x * xWeight, worldPos.y * 1., worldPos.z * 1.)
	+ spinePos;

vec3 transformedNormal = normalMatrix * (basis * objectNormal);
			`,
      )
      .replace(
        "#include <project_vertex>",
        `vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
				gl_Position = projectionMatrix * mvPosition;`,
      );

    shader.vertexShader = vertexShader;
  };
}

/**
 * A modifier for making meshes bend around curves.
 */
export class Flow {
  curveArray: Array<Curve<any> | undefined>;
  curveLengthArray: Array<number>;
  object3D: any;
  splineTexture: DataTexture;
  uniforms: any;

  constructor(mesh: Mesh, numberOfCurves = 1) {
    const obj3D = mesh.clone();
    const splineTexture = initSplineTexture(numberOfCurves);
    const uniforms = getUniforms(splineTexture);

    obj3D.traverse(function (child) {
      if (child instanceof Mesh || child instanceof InstancedMesh) {
        if (Array.isArray(child.material)) {
          const materials = [];

          for (const material of child.material) {
            const newMaterial = material.clone();
            modifyShader(newMaterial, uniforms, numberOfCurves);
            materials.push(newMaterial);
          }

          child.material = materials;
        } else {
          child.material = child.material.clone();
          modifyShader(child.material, uniforms, numberOfCurves);
        }
      }
    });

    this.curveArray = new Array(numberOfCurves);
    this.curveLengthArray = new Array(numberOfCurves);

    this.object3D = obj3D;
    this.splineTexture = splineTexture;
    this.uniforms = uniforms;
  }

  updateCurve(index: number, curve: Curve<any>) {
    if (index >= this.curveArray.length)
      throw Error("Flow: Index out of range.");
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
