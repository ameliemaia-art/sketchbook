export type DrawSettings = {
  width: number;
  alpha: number;
  color: paper.Color;
};

export type Settings = {
  scale: number;
  opacity: number;
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
