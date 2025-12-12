import { useEffect, useRef } from "react";

import PathProfileSketch, { GUIPathProfile } from "./path-profile";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Geometry/PathProfile",
};

export const PathProfile = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current && canvasRef.current) {
      const pane = new Pane({ title: "PathProfile" });
      const pathProfile = new PathProfileSketch(
        rootRef.current,
        canvasRef.current,
      );
      new GUIPathProfile(pane, pathProfile);
    }

    return () => {};
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
