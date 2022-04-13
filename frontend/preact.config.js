export default function (config, env, helpers) {
  let css = helpers.getLoadersByName(config, "css-loader")[0];
  css.loader.options.modules = false;

  config.resolve.modules.push(env.src);
  return config;
}
