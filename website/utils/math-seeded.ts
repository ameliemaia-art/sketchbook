class MathSeeded {
  _seed = 0;
  _seedValue = 0;
  seedIsSet = false;

  constructor() {}

  setSeed(value: number) {
    this._seed = structuredClone(value);
    this._seedValue = structuredClone(value);
    this.seedIsSet = true;
    console.log("setSeed:", value);
  }

  resetSeed() {
    // console.log("reset seed!");
    this._seed = structuredClone(this._seedValue);
  }

  // From three.js MathUtils
  random() {
    // Mulberry32 generator
    if (!this.seedIsSet) {
      console.warn("Please set a seed before using seededRandom");
    }

    let t = (this._seed += 0x6d2b79f5);

    t = Math.imul(t ^ (t >>> 15), t | 1);

    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  randFloat(low: number, high: number) {
    return low + this.random() * (high - low);
  }

  randInt(low: number, high: number) {
    return low + Math.floor(this.random() * (high - low));
  }

  randItem(array: any[]) {
    return array[this.randInt(0, array.length)];
  }

  shuffle<T>(array: T[]) {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.randInt(0, i + 1); // Random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }

    return array;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new MathSeeded();
