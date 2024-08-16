import * as ls from "local-storage";

class GUIStore {
  data: { [key: string]: unknown } = {};

  constructor() {
    const data = ls.get<string>("gui-store");
    if (data) {
      this.data = JSON.parse(data);
    }
  }

  set<T>(key: string, value: T) {
    this.data[key] = value;
    ls.set<string>("gui-store", this.serialize());
  }

  get(key: string) {
    if (this.data[key]) {
      return this.data[key];
    }
  }

  serialize() {
    return JSON.stringify(this.data);
  }
}

const store = new GUIStore();

export default store;
