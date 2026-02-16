import { useEffect, useRef } from "react";

import TemplateSketch, { GUITemplate } from "./template";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Template",
};

export const Template = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pane: Pane | undefined;
    if (rootRef.current && canvasRef.current) {
      pane = new Pane({ title: "Template" });
      const blueprint = new TemplateSketch(rootRef.current, canvasRef.current);
      new GUITemplate(pane, blueprint);
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
