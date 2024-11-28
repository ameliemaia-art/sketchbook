import { useEffect, useRef } from "react";

import Tetrahedron64Sketch, { GUITetrahedron64 } from "./tetrahedron-64";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Tetrahedron 64",
};

export const Tetrahedron64 = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new Tetrahedron64Sketch(rootRef.current);
      new GUITetrahedron64(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
