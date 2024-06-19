import paper from "paper";
import { Pane } from "tweakpane";

import { saveImage } from "@utils/common/file";
import { creation, moon, realm, stars, structure } from "./Form";

// Adjust this if canvas size changes
// 512 = 1 for original logo
const strokeScale = 1;

export default class Identity {
  settings = {
    scale: 0.25,
    creation: {
      width: 2 * strokeScale,
      alpha: 1,
      color: new paper.Color(0),
    },
    stars: {
      width: 1 * strokeScale,
      alpha: 1,
      color: new paper.Color(0),
    },
    realm: {
      width: 1 * strokeScale,
      alpha: 0.5,
      color: new paper.Color(0),
    },
    moon: {
      alpha: 1,
      color: new paper.Color(0),
    },
    icoshahedron: {
      front: {
        width: 1.5 * strokeScale,
        alpha: 1,
        color: new paper.Color(0),
      },
      back: {
        width: 1.5 * strokeScale,
        alpha: 0.5,
        color: new paper.Color(0),
      },
    },
    debug: {
      width: 1,
      color: new paper.Color(1, 1, 1, 0),
    },
  };

  constructor(public canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    canvas.width = 500;
    canvas.height = 500;
    paper.setup(canvas);

    this.draw();
  }

  draw = () => {
    paper.project.activeLayer.removeChildren();

    const radius = paper.view.size.width * this.settings.scale;
    const center = paper.view.bounds.center;

    let innerRadius = radius / 3;
    innerRadius -= innerRadius / 2.5;

    // Update colors
    this.settings.creation.color.set([
      this.settings.creation.alpha,
      this.settings.creation.alpha,
      this.settings.creation.alpha,
    ]);
    this.settings.stars.color.set([
      this.settings.stars.alpha,
      this.settings.stars.alpha,
      this.settings.stars.alpha,
    ]);
    this.settings.realm.color.set([
      this.settings.realm.alpha,
      this.settings.realm.alpha,
      this.settings.realm.alpha,
    ]);
    this.settings.moon.color.set([
      this.settings.moon.alpha,
      this.settings.moon.alpha,
      this.settings.moon.alpha,
    ]);
    this.settings.icoshahedron.front.color.set([
      this.settings.icoshahedron.front.alpha,
      this.settings.icoshahedron.front.alpha,
      this.settings.icoshahedron.front.alpha,
    ]);
    this.settings.icoshahedron.back.color.set([
      this.settings.icoshahedron.back.alpha,
      this.settings.icoshahedron.back.alpha,
      this.settings.icoshahedron.back.alpha,
    ]);
    paper.view.rotate(180);

    structure(
      this.settings,
      center,
      radius / 0.5,
      innerRadius / 0.5,
      false,
      true,
    );
    creation(this.settings, center, radius);
    structure(this.settings, center, radius, innerRadius);
    realm(this.settings, center, radius, innerRadius);
    moon(this.settings, center, radius, innerRadius);
    stars(this.settings, center, radius, innerRadius);
    structure(
      this.settings,
      center,
      radius / 0.5,
      innerRadius / 0.5,
      true,
      false,
    );
  };

  export = () => {
    saveImage(this.canvas, "identity");
  };
}

export class IdentityGUI {
  gui: Pane;

  constructor(public target: Identity) {
    this.gui = new Pane({ title: "Identity" });

    this.gui.addButton({ title: "Export" }).on("click", target.export);
    this.gui
      .addBinding(target.settings, "scale", { min: 0, max: 0.5 })
      .on("change", target.draw);

    const guiCreation = this.gui.addFolder({ title: "creation" });
    const guiRealm = this.gui.addFolder({ title: "realm" });
    const guiStars = this.gui.addFolder({ title: "stars" });
    const guiMoon = this.gui.addFolder({ title: "moon" });
    const guiFront = this.gui.addFolder({ title: "front" });
    const guiBack = this.gui.addFolder({ title: "back" });
    const guiDebug = this.gui.addFolder({ title: "debug" });

    guiCreation
      .addBinding(target.settings.creation, "width", { min: 0, max: 5 })
      .on("change", target.draw);
    guiCreation
      .addBinding(target.settings.creation, "alpha", { min: 0, max: 1 })
      .on("change", target.draw);

    guiStars
      .addBinding(target.settings.stars, "width", { min: 0, max: 5 })
      .on("change", target.draw);
    guiStars
      .addBinding(target.settings.stars, "alpha", { min: 0, max: 1 })
      .on("change", target.draw);

    guiRealm
      .addBinding(target.settings.realm, "width", { min: 0, max: 5 })
      .on("change", target.draw);
    guiRealm
      .addBinding(target.settings.realm, "alpha", { min: 0, max: 1 })
      .on("change", target.draw);

    guiMoon
      .addBinding(target.settings.moon, "alpha", { min: 0, max: 1 })
      .on("change", target.draw);

    guiFront
      .addBinding(target.settings.icoshahedron.front, "width", {
        min: 0,
        max: 5,
      })
      .on("change", target.draw);
    guiFront
      .addBinding(target.settings.icoshahedron.front, "alpha", {
        min: 0,
        max: 1,
      })
      .on("change", target.draw);
    guiBack
      .addBinding(target.settings.icoshahedron.back, "width", {
        min: 0,
        max: 5,
      })
      .on("change", target.draw);
    guiBack
      .addBinding(target.settings.icoshahedron.back, "alpha", {
        min: 0,
        max: 1,
      })
      .on("change", target.draw);

    guiDebug
      .addBinding(target.settings.debug, "width", { min: 0, max: 5 })
      .on("change", target.draw);
    guiDebug
      .addBinding(target.settings.debug.color, "alpha", { min: 0, max: 1 })
      .on("change", target.draw);
  }
}
