import paper from "paper";
import { FolderApi, Pane } from "tweakpane";

import { composite, saveImage, saveSVG } from "@utils/common/file";
import GUIController from "@utils/gui/gui";
import { creation, moon, realm, stars, structure } from "./form";
import { Settings } from "./types";

// Adjust this if canvas size changes
// 512 = 1 for original logo
const strokeScale = 1;

export default class Identity {
  settings: Settings = {
    scale: 0.25,
    opacity: 1,
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

  constructor(
    public canvas: HTMLCanvasElement,
    setup = true,
  ) {
    this.canvas = canvas;

    if (setup) {
      canvas.width = 500;
      canvas.height = 500;
      paper.setup(canvas);
    }

    this.draw();
  }

  draw = () => {
    paper.project.activeLayer.removeChildren();

    let group = new paper.Group();
    group.opacity = this.settings.opacity;

    // create a rectangle to fill the background
    // const background = new paper.Path.Rectangle(
    //   paper.view.bounds.topLeft,
    //   paper.view.bounds.bottomRight,
    // );
    // color the background black
    // background.fillColor = new paper.Color(0, 0, 0);
    // group.addChild(background);

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

    group.addChild(
      structure(
        this.settings,
        center,
        radius / 0.5,
        innerRadius / 0.5,
        false,
        true,
      ),
    );
    group.addChild(creation(this.settings, center, radius));
    group.addChild(structure(this.settings, center, radius, innerRadius));
    group.addChild(realm(this.settings, center, radius, innerRadius));
    group.addChild(moon(this.settings, center, radius, innerRadius));
    group.addChild(stars(this.settings, center, radius, innerRadius));
    group.addChild(
      structure(
        this.settings,
        center,
        radius / 0.5,
        innerRadius / 0.5,
        true,
        false,
      ),
    );

    paper.view.rotate(180);
  };

  saveImage = () => {
    saveImage(this.canvas, "identity");

    // const composition = composite(
    //   this.canvas.width / 2,
    //   this.canvas.height / 2,
    //   [this.canvas],
    // );
    // saveImage(composition, "identity");
  };

  saveSVG = () => {
    saveSVG(paper.project, "identity");
  };
}

export class IdentityGUI extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: Identity,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Identity" });

    this.gui.addButton({ title: "Save Image" }).on("click", target.saveImage);
    this.gui.addButton({ title: "Save SVG" }).on("click", target.saveSVG);
    this.gui
      .addBinding(target.settings, "scale", { min: 0, max: 0.5 })
      .on("change", target.draw);
    this.gui
      .addBinding(target.settings, "opacity", { min: 0, max: 1 })
      .on("change", target.draw);

    const guiCreation = this.addFolder(this.gui, { title: "creation" });
    const guiRealm = this.addFolder(this.gui, { title: "realm" });
    const guiStars = this.addFolder(this.gui, { title: "stars" });
    const guiMoon = this.addFolder(this.gui, { title: "moon" });
    const guiFront = this.addFolder(this.gui, { title: "front" });
    const guiBack = this.addFolder(this.gui, { title: "back" });
    const guiDebug = this.addFolder(this.gui, { title: "debug" });

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
