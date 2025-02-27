import { useEffect, useRef } from "react";

import Tetrahedron64Sketch, { GUITetrahedron64 } from "./tetrahedron-64";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Sacred/Tetrahedron 64",
};

export const Tetrahedron64 = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new Tetrahedron64Sketch(rootRef.current);
      new GUITetrahedron64(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
