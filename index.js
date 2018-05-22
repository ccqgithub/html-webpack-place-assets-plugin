module.exports = class HtmlWebpackPlaceAssetsPlugin {
  constructor(options) {
    this.options = options;
  }

  apply (compiler) {
    const self = this;

    compiler.hooks.compilation.tap('HtmlWebpackPluginHooks', compilation => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapPromise(
        'htmlWebpackPluginBeforeHtmlProcessing',
        (pluginArgs) => {
          const headRegExp = self.options.headReplaceExp;
          const bodyRegExp = self.options.bodyReplaceExp;
          const tagsJoin = self.options.tagsJoin || '\n';
          const assetTags = pluginArgs.plugin.generateHtmlTags(pluginArgs.assets);
          const body = assetTags.body.map(pluginArgs.plugin.createHtmlTag);
          const head = assetTags.head.map(pluginArgs.plugin.createHtmlTag);
          let html = pluginArgs.html;

          html = html.replace(bodyRegExp, function (match) {
            return body.join(tagsJoin);
          });

          html = html.replace(headRegExp, function (match) {
            return head.join(tagsJoin);
          });

          pluginArgs.html = html;

          return Promise.resolve(pluginArgs);
        }
      );
    });
  }
}