import { create } from "@storybook/theming/create";

const black = "rgba(0, 0, 0, 0.95)";
const text = "rgba(255, 255, 255, 0.5)";

export default create({
  base: "dark",
  brandTitle: "IXIIIIIXI",
  brandUrl: "https://ameliemaia.art/",
  brandImage: "./assets/images/identity.svg",
  brandTarget: "_self",

  //
  colorPrimary: "#ffffff",
  colorSecondary: "#000000",

  // UI
  appBg: black,
  appContentBg: black,
  // appPreviewBg: black,
  appBorderColor: "#585C6D",
  appBorderRadius: 4,

  // Text colors
  textColor: text,
  textInverseColor: "#000000",

  // Toolbar default and active colors
  barTextColor: text,
  barSelectedColor: "#585C6D",
  barHoverColor: "#585C6D",
  barBg: "#000000",

  // Form colors
  inputBg: black,
  inputBorder: "#10162F",
  inputTextColor: "#10162F",
  inputBorderRadius: 2,
});
