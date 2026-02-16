import { useEffect, useRef } from "react";

import AscensionSketch, { GUIAscension } from "./ascension";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/God/Ascension",
};

export const Ascension = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pane: Pane | undefined;
    if (rootRef.current && canvasRef.current) {
      pane = new Pane({ title: "Ascension" });
      const blueprint = new AscensionSketch(rootRef.current, canvasRef.current);
      new GUIAscension(pane, blueprint);
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
