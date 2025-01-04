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
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new VectorEquilibriumSphericalSketch(rootRef.current);
      new GUIVectorEquilibriumSpherical(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
