import { useEffect, useRef } from "react";

import GoldenRectangleSketch, { GUIGoldenRectangle } from "./golden-rectangle";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Golden Rectangle",
};

export const GoldenRectangle = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new GoldenRectangleSketch(rootRef.current);
      new GUIGoldenRectangle(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
