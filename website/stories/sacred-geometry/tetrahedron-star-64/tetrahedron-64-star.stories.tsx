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
    if (rootRef.current) {
      const sacred = new Tetrahedron64StarSketch(rootRef.current);
      new GUITetrahedron64Star(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
