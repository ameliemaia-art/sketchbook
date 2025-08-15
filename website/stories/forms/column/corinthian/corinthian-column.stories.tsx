import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";

import "../../../global.css";

import ColumnCorinthianForm, { GUICorinthianForm } from "./corinthian-column";

export default { title: "Sketchbook/Forms/Corinthian Column" };

export const CorinthianColumn = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return () => {};
    const root = rootRef.current;

    const app = new ColumnCorinthianForm();
    app
      .setup(root)
      .then(() => {})
      .catch((error) => {
        console.log("error setting up", error);
      });

    const gui = new Pane({
      title: "Metaphysical Form - Corinthian Column",
    });
    new GUICorinthianForm(gui, app);

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
