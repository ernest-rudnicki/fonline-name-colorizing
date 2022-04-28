export default function (config, env, helpers) {
  // disable CSS modules
  const css = helpers.getLoadersByName(config, "css-loader")[0];
  css.loader.options.modules = false;

  // less loader to override ANTD variables
  config.module.rules.push({
    // LESS
    enforce: "pre",
    test: /\.less$/,
    use: [
      {
        loader: require.resolve("less-loader"),
        options: {
          sourceMap: true,
          lessOptions: {
            modifyVars: {
              "primary-color": "#285486",
            },
            javascriptEnabled: true,
          },
        },
      },
    ],
  });

  // aliases config
  config.resolve.modules.push(env.src);
  return config;
}
