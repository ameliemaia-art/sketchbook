import { addons } from "@storybook/manager-api";

import theme from "./theme";

addons.setConfig({
  theme,
  bottomPanelHeight: 0,
  rightPanelWidth: 0,
});
