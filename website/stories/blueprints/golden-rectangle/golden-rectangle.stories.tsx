import { useEffect, useRef } from "react";

import GoldenRectangleSketch, { GUIGoldenRectangle } from "./golden-rectangle";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Sacred/Golden Rectangle",
};

export const GoldenRectangle = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new GoldenRectangleSketch(rootRef.current);
      new GUIGoldenRectangle(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
