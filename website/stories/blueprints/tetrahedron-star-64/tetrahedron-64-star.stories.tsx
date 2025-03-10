import { useEffect, useRef } from "react";

import Tetrahedron64StarSketch, {
  GUITetrahedron64Star,
} from "./tetrahedron-64-star";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Sacred/Tetrahedron 64 Star",
};

export const Tetrahedron64Star = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current && canvasRef.current) {
      const sacred = new Tetrahedron64StarSketch(
        rootRef.current,
        canvasRef.current,
      );
      new GUITetrahedron64Star(pane, sacred);
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
