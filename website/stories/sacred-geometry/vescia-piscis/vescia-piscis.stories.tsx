import { useEffect, useRef } from "react";

import VesicaPiscisSketch, { GUIVesicaPiscis } from "./vescia-piscis";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Vesica Piscis",
};

export const VesicaPiscis = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new VesicaPiscisSketch(rootRef.current);
      new GUIVesicaPiscis(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
