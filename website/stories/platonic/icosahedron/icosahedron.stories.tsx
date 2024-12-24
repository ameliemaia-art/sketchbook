import { useEffect, useRef } from "react";

import IcosahedronSketch, { GUIIcosahedron } from "./icosahedron";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Platonic/Icosahedron",
};

export const Icosahedron = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new IcosahedronSketch(rootRef.current);
      new GUIIcosahedron(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
