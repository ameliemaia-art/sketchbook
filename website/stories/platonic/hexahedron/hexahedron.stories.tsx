import { useEffect, useRef } from "react";

import HexahedronSketch, { GUIHexahedron } from "./hexahedron";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Platonic/Hexahedron",
};

export const Hexahedron = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new HexahedronSketch(rootRef.current);
      new GUIHexahedron(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
