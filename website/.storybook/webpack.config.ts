// Export a function. Accept the base config as the only param.
module.exports = async ({ config }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push(
    {
      test: /\.worker\.js$/,
      use: { loader: "worker-loader" },
    },
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "ifdef-loader",
          options: {
            DEBUG: true,
            version: 3,
            "ifdef-verbose": false, // add this for verbose output
          },
        },
      ],
    },
  );

  // Return the altered config
  return config;
};
