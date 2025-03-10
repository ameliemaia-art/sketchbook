import { useEffect, useRef } from "react";

import VectorEquilibriumSphericalSketch, {
  GUIVectorEquilibriumSpherical,
} from "./vector-equilibrium-spherical";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Sacred/Vector Equilibrium Spherical",
};

export const VectorEquilibriumSpherical = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current && canvasRef.current) {
      const sacred = new VectorEquilibriumSphericalSketch(
        rootRef.current,
        canvasRef.current,
      );
      new GUIVectorEquilibriumSpherical(pane, sacred);
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
