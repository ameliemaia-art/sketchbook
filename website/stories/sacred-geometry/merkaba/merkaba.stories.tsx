import { useEffect, useRef } from "react";

import MerkabaSketch, { GUIMerkaba } from "./merkaba";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Merkaba",
};

export const Merkaba = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new MerkabaSketch(rootRef.current);
      new GUIMerkaba(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
