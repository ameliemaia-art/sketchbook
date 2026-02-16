import { useEffect, useRef } from "react";

import MerkabaSketch, { GUIMerkaba } from "./merkaba";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Sacred/Merkaba",
};

export const Merkaba = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pane: Pane | undefined
    if (rootRef.current && canvasRef.current) {
      pane = new Pane({ title: "Sacred Geometry" })
      const sacred = new MerkabaSketch(rootRef.current, canvasRef.current);
      new GUIMerkaba(pane, sacred);
    }

    return () => {
      pane?.dispose();
    };
  }, []);

  return (
    <div className="sketch">
      <p className="load-font-stencil load-font-regular">IXIIIIIXI</p>
      <div className="wordmark" ref={rootRef}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};
