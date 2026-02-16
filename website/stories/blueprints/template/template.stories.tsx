import { useEffect, useRef } from "react";

import TemplateSketch, { GUITemplate } from "./template";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Template",
};

export const EggOfLife = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Template" });
    if (rootRef.current && canvasRef.current) {
      const sacred = new TemplateSketch(rootRef.current, canvasRef.current);
      new GUITemplate(pane, sacred);
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
