import { useEffect, useRef } from "react";

import DodecahedronSketch, { GUIDodecahedron } from "./dodecahedron";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Platonic/Dodecahedron",
};

export const Dodecahedron = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new DodecahedronSketch(rootRef.current);
      new GUIDodecahedron(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
