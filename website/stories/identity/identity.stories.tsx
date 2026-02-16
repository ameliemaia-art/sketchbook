import { useEffect, useRef } from "react";

import IdentitySketch, { IdentityGUI } from "./identity";

import "../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Identity/Logo",
};

export const Logo = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pane: Pane | undefined;
    if (rootRef.current) {
      pane = new Pane({ title: "Identity" });
      const identity = new IdentitySketch(rootRef.current);
      const gui = new IdentityGUI(pane, identity);
    }

    return () => {
      pane?.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
