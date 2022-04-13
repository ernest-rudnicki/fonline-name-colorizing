module.exports = function (config, env, helpers) {
  let css = helpers.getLoadersByName(config, "css-loader")[0];
  css.loader.options.modules = false;
};
