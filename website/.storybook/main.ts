import type { StorybookConfig } from "@storybook/nextjs";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],

  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },

  staticDirs: ["../public"],

  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }
    return config;
  },

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};
export default config;
