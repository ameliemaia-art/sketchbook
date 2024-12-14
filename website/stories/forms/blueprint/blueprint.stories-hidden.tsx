import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";

import BlueprintSketch, { GUIBlueprintSketch } from "./blueprint";

import "../../global.css";

// export default { title: "Sketchbook/Forms/Blueprint", tags: ["!dev"] };

export const Blueprint = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return () => {};
    const root = rootRef.current;

    const app = new BlueprintSketch();
    app
      .setup(root)
      .then(() => {})
      .catch((error) => {
        console.log("error setting up", error);
      });

    const gui = new Pane({
      title: "Metaphysical Form - Blueprint",
    });
    new GUIBlueprintSketch(gui, app);

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
