import { useEffect, useRef } from "react";

import IdentitySketch, { IdentityGUI } from "./identity";

import "../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Identity",
};

export const Identity = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const identity = new IdentitySketch(rootRef.current);
      const gui = new IdentityGUI(new Pane({ title: "Identity" }), identity);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
