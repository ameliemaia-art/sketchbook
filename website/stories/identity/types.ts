export type DrawSettings = {
  width: number;
  alpha: number;
  color: paper.Color;
};

export type Settings = {
  scale: number;
  opacity: number;
  darkness: boolean;
  creation: DrawSettings;
  stars: DrawSettings;
  realm: DrawSettings;
  moon: {
    alpha: number;
    color: paper.Color;
  };
  icoshahedron: {
    front: DrawSettings;
    back: DrawSettings;
  };
  debug: {
    width: number;
    color: paper.Color;
  };
};
