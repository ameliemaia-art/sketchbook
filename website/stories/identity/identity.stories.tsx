import { useEffect, useRef } from "react";

import createCanvas from "@utils/common/canvas";
import IdentitySketch, { IdentityGUI } from "./Identity";

import "./Identity.css";
import "../global.css";

export default { title: "Sketchbook/Identity" };

export const Identity = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const identity = new IdentitySketch(rootRef.current);
      const gui = new IdentityGUI(identity);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
