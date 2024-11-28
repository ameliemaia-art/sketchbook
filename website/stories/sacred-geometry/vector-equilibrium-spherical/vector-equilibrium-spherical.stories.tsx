import { useEffect, useRef } from "react";

import VectorEquilibriumSphericalSketch, {
  GUIVectorEquilibriumSpherical,
} from "./vector-equilibrium-spherical";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Vector Equilibrium Spherical",
};

export const VectorEquilibriumSpherical = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new VectorEquilibriumSphericalSketch(rootRef.current);
      new GUIVectorEquilibriumSpherical(
        new Pane({ title: "Sacred Geometry" }),
        sacred,
      );
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
