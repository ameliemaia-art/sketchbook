import * as ls from "local-storage";
import { Euler, PerspectiveCamera, Vector3Tuple } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import { generateBindingOptions } from "@utils/editor/gui/gui-utils";

export type Bookmark = {
  position: number[];
  rotation: Array<number | string | undefined>;
  target: number[];
};

export type Bookmarks = { [key: string]: Bookmark };

export default class BookmarkManager {
  bookmark = "0";
  bookmarks: Bookmarks = {};
  animate = true;

  constructor(
    public id: string,
    public camera: PerspectiveCamera,
    public controls: OrbitControls,
  ) {
    for (let i = 0; i < 9; i++) {
      this.bookmarks[i.toString()] = {
        position: [0, 1, 5],
        rotation: [0, 0, 0, Euler.DEFAULT_ORDER],
        target: [0, 0, 0],
      };
    }

    this.loadBookmarks();
    this.goToBookmark(this.bookmark);
    // this.addKeyListener();
  }

  addKeyListener() {
    window.addEventListener("keydown", (event) => {
      if (event.key >= "0" && event.key <= "9") {
        this.goToBookmark(event.key);
      }
    });
  }

  get storeId() {
    return `bookmarks-${this.id}`;
  }

  get totalBookmarks() {
    return Object.keys(this.bookmarks).length;
  }

  loadBookmarks() {
    const data = ls.get(this.storeId) as string;

    if (data) {
      const bookmarks = JSON.parse(data);

      for (const key in bookmarks) {
        if (Object.prototype.hasOwnProperty.call(bookmarks, key)) {
          this.bookmarks[key] = bookmarks[key];
        }
      }
    }
  }

  goToBookmark(name: string) {
    this.camera.position.fromArray(this.bookmarks[name].position);
    this.camera.rotation.fromArray(
      this.bookmarks[name].rotation as [number, number, number],
    );
    this.camera.updateMatrixWorld();
    if (Array.isArray(this.bookmarks[name].target)) {
      this.controls.target.fromArray(
        this.bookmarks[name].target as Vector3Tuple,
      );
    }
    this.controls.update();
  }
}

export class GUIBookmarkManager extends GUIController {
  constructor(gui: GUIType, target: BookmarkManager) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "BookmarkManager" });

    const bookmarks = Object.keys(target.bookmarks);

    this.gui
      .addBinding(target, "bookmark", {
        options: generateBindingOptions(bookmarks),
      })
      .on("change", (event) => {
        target.goToBookmark(event.value);
      });

    this.gui.addButton({ title: "Reset Camera", label: "" }).on("click", () => {
      target.goToBookmark(target.bookmark.toString());
    });

    this.gui.addButton({ title: "Save", label: "" }).on("click", () => {
      const data: Bookmark = {
        position: target.camera.position.toArray(),
        rotation: target.camera.rotation.toArray(),
        target: target.controls.target.toArray(),
      };
      target.bookmarks[target.bookmark.toString()] = data;
      ls.set(target.storeId, JSON.stringify(target.bookmarks));
    });
  }
}
