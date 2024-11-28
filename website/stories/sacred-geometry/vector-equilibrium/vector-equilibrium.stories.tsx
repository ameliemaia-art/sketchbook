import { useEffect, useRef } from "react";

import VectorEquilibriumSketch, {
  GUIVectorEquilibrium,
} from "./vector-equilibrium";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Vector Equilibrium",
};

export const VectorEquilibrium = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new VectorEquilibriumSketch(rootRef.current);
      new GUIVectorEquilibrium(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
