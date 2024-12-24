import { useEffect, useRef } from "react";

import OctahedronSketch, { GUIOctahedron } from "./octahedron";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Platonic/Octahedron",
};

export const Octahedron = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new OctahedronSketch(rootRef.current);
      new GUIOctahedron(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
