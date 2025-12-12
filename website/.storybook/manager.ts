import { addons } from "storybook/manager-api";

import theme from "./theme";

addons.setConfig({
  theme,
});

addons.register("custom-panel", (api) => {
  api.togglePanel(false);
});
