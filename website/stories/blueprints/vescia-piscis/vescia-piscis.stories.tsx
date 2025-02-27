import { useEffect, useRef } from "react";

import VesicaPiscisSketch, { GUIVesicaPiscis } from "./vescia-piscis";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Sacred/Vesica Piscis",
};

export const VesicaPiscis = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new VesicaPiscisSketch(rootRef.current);
      new GUIVesicaPiscis(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
