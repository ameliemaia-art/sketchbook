import { useEffect, useRef } from "react";

import MerkabaSketch, { GUIMerkaba } from "./merkaba";

import "../../global.css";
import "./merkaba.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred Geometry/Merkaba",
};

export const Merkaba = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new MerkabaSketch(rootRef.current);
      new GUIMerkaba(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
