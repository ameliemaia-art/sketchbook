import { useEffect, useRef } from "react";

import Tetrahedron64StarSketch, {
  GUITetrahedron64Star,
} from "./tetrahedron-64-star";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Tetrahedron 64 Star",
};

export const Tetrahedron64Star = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new Tetrahedron64StarSketch(rootRef.current);
      new GUITetrahedron64Star(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
