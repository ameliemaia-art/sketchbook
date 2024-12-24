import { useEffect, useRef } from "react";

import TetrahedronSketch, { GUIIcosahedron } from "./tetrahedron";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Platonic/Tetrahedron",
};

export const Tetrahedron = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new TetrahedronSketch(rootRef.current);
      new GUIIcosahedron(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
