const path = require("path");

module.exports = {
  webpack: {
    alias: {
      components: path.resolve(__dirname, "client/components/"),
      hooks: path.resolve(__dirname, "client/hooks/"),
      data: path.resolve(__dirname, "client/data/"),
      types: path.resolve(__dirname, "client/types/"),
      routes: path.resolve(__dirname, "client/routes/"),
      assets: path.resolve(__dirname, "client/assets/"),
      client: path.resolve(__dirname, "client/"),
    },
    configure: (webpackConfig, { paths }) => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) =>
          constructor && constructor.name === "ModuleScopePlugin"
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

      return webpackConfig;
    },
  },
};
