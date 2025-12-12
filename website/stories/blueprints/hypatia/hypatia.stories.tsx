import { useEffect, useRef } from "react";

import HypatiaSketch, { GUIHypatia } from "./hypatia";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Human/Hypatia",
};

export const Hypatia = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Human" });
    if (rootRef.current && canvasRef.current) {
      const hypatia = new HypatiaSketch(rootRef.current, canvasRef.current);
      new GUIHypatia(pane, hypatia);
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
