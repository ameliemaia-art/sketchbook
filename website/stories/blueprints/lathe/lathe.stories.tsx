import { useEffect, useRef } from "react";

import LatheSketch, { GUILathe } from "./lathe";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Geometry/Lathe",
};

export const Lathe = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Lathe" });
    if (rootRef.current && canvasRef.current) {
      const lathe = new LatheSketch(rootRef.current, canvasRef.current);
      new GUILathe(pane, lathe);
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
