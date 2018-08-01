module.exports = class HtmlWebpackPlaceAssetsPlugin {
  constructor(options) {
    this.options = options;
  }

  apply (compiler) {
    const self = this;

    compiler.hooks.compilation.tap('HtmlWebpackPluginHooks', compilation => {
      // alter the chunks and the chunk sorting
      compilation.hooks.htmlWebpackPluginAlterChunks.tap(
        'htmlWebpackPlaceAssetsPluginAlterChunks',
        (chunks, {plugin}) => {
          const entry = plugin.options.entry;
          const entrypoint = compilation.entrypoints.get(entry);
          return entrypoint.chunks.map(chunk =>
            ({
                names: chunk.name ? [chunk.name] : [],
                files: chunk.files.slice(),
                size: chunk.modulesSize(),
                hash: chunk.hash
            })
          );
        }
      );

      // insert assets
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapPromise(
        'htmlWebpackPlaceAssetsPluginInject',
        (pluginArgs) => {
          const headRegExp = self.options.headReplaceExp;
          const bodyRegExp = self.options.bodyReplaceExp;
          const tagsJoin = self.options.tagsJoin || '\n';
          const assetTags = pluginArgs.plugin.generateHtmlTags
            .bind(pluginArgs.plugin)(pluginArgs.assets);
          const body = assetTags.body.map(
            pluginArgs.plugin.createHtmlTag.bind(pluginArgs.plugin.createHtmlTag)
          );
          const head = assetTags.head.map(
            pluginArgs.plugin.createHtmlTag.bind(pluginArgs.plugin)
          );
          
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