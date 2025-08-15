import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";

import "../../../global.css";

import ColumnIonicForm, { GUIColumnIonicForm } from "./ionic-column";

export default { title: "Sketchbook/Forms/Ionic Column" };

export const IonicColumn = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return () => {};
    const root = rootRef.current;

    const app = new ColumnIonicForm();
    app
      .setup(root)
      .then(() => {})
      .catch((error) => {
        console.log("error setting up", error);
      });

    const gui = new Pane({
      title: "Metaphysical Form - Ionic Column",
    });
    new GUIColumnIonicForm(gui, app);

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
