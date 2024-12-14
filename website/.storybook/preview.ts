import type { Preview } from "@storybook/react";

export const globals = {
  backgrounds: {
    grid: true, //enable grid by default
  },
};

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        // method: "alphabetical",
        order: ["Sacred", "Identity", "Sound"],
      },
    },
    controls: {
      disabled: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: {
        responsive: {
          name: "Responsive",
        },
        phone: {
          name: "Phone",
          type: "mobile",
          styles: { height: "560px", width: "375px" },
        },
        tablet: {
          name: "Tablet",
          type: "tablet",
          styles: { height: "910px", width: "768px" },
        },
        desktop: {
          name: "Desktop",
          type: "tablet",
          styles: { height: "810px", width: "1440px" },
        },
      },
    },
  },
};

export default preview;
