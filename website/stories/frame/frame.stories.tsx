import { useEffect, useRef } from "react";

import "./frame.css";
import "../global.css";

import { Pane } from "tweakpane";

import FrameComponent, { GUIFrame } from "./frame";

export default { title: "Sketchbook/Frame" };

export const Frame = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pane: Pane | undefined;
    if (rootRef.current) {
      pane = new Pane({ title: "Frame" });
      const wordmark = new FrameComponent(rootRef.current);
      new GUIFrame(pane, wordmark);
    }

    return () => {
      pane?.dispose();
    };
  }, []);

  return (
    <div className="sketch">
      <p className="load-font-stencil">IXIIIIIXI</p>
      <div className="frame" ref={rootRef} />
    </div>
  );
};
