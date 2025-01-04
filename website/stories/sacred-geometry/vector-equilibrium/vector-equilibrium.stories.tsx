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
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new VectorEquilibriumSketch(rootRef.current);
      new GUIVectorEquilibrium(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
