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
    if (rootRef.current) {
      const wordmark = new FrameComponent(rootRef.current);
      new GUIFrame(new Pane({ title: "Frame" }), wordmark);
    }

    return () => {};
  }, []);

  return (
    <div className="sketch">
      <p className="load-font-stencil">IXIIIIIXI</p>
      <div className="frame" ref={rootRef} />
    </div>
  );
};
