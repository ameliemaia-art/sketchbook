import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";

import GraphSketch, { GUIGraph } from "./graph";

export default {
  title: "Sketchbook/Math/Graph",
};

export const Graph = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current && canvasRef.current) {
      const pane = new Pane({ title: "Graph" });
      const sacred = new GraphSketch(rootRef.current, canvasRef.current);
      new GUIGraph(pane, sacred);
    }

    return () => {};
  }, []);

  return (
    <div className="sketch">
      <div ref={rootRef}>
        <canvas ref={canvasRef} />;
      </div>
    </div>
  );
};
