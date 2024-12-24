import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";

import PlatonicSketch, { GUIPlatonicSketch } from "./platonic";

import "../../global.css";

export default { title: "Sketchbook/Forms/Platonic" };

export const Platonic = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return () => {};
    const root = rootRef.current;

    const app = new PlatonicSketch();
    app
      .setup(root)
      .then(() => {})
      .catch((error) => {
        console.log("error setting up", error);
      });

    const gui = new Pane({
      title: "Metaphysical Form - Platonic",
    });
    new GUIPlatonicSketch(gui, app);

    const resize = () => {
      app.resize(window.innerWidth, window.innerHeight);
    };
    resize();

    window.addEventListener("resize", resize);

    return () => {
      app.dispose();
    };
  }, []);

  return <div className="webgl-app" ref={rootRef}></div>;
};
