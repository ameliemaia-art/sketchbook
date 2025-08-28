class GUIStore {
  data: { [key: string]: unknown } = {};

  constructor() {
    if (typeof window !== "undefined" && window.localStorage) {
      const data = window.localStorage.getItem("gui-store");
      if (data) {
        this.data = JSON.parse(data);
      }
    }
  }

  set<T>(key: string, value: T) {
    this.data[key] = value;
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("gui-store", this.serialize());
    }
  }

  get(key: string) {
    return this.data[key];
  }

  serialize() {
    return JSON.stringify(this.data);
  }
}

const store = new GUIStore();

export default store;
