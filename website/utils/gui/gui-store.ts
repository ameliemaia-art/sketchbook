import * as ls from "local-storage";

class GUIStore {
  data: { [key: string]: { [key: string]: unknown } } = {};

  constructor() {
    const data = ls.get<any>("ixiiiiixi-sketchbook");
    if (data) {
      this.data = data;
    }
  }

  set<T>(group: string, key: string, value: T) {
    if (!this.data[group]) {
      this.data[group] = {};
    }
    this.data[group][key] = value;
    ls.set<any>("ixiiiiixi-sketchbook", this.data);
  }

  get(group: string, key: string) {
    if (this.data[group] === undefined) {
      return undefined;
    }
    if (this.data[group][key] !== undefined) {
      return this.data[group][key];
    }
  }
}

const store = new GUIStore();

export default store;
