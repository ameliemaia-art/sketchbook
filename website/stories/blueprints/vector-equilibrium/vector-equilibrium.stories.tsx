import { useEffect, useRef } from "react";

import VectorEquilibriumSketch, {
  GUIVectorEquilibrium,
} from "./vector-equilibrium";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Sacred/Vector Equilibrium",
};

export const VectorEquilibrium = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current && canvasRef.current) {
      const sacred = new VectorEquilibriumSketch(
        rootRef.current,
        canvasRef.current,
      );
      new GUIVectorEquilibrium(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return (
    <div className="sketch">
      <p className="load-font-stencil load-font-regular">IXIIIIIXI</p>
      <div className="wordmark" ref={rootRef}>
        <canvas ref={canvasRef} />;
      </div>
    </div>
  );
};
