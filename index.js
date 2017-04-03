// HtmlWebpackPlaceAssetsPlugin for html-webpack-plugin

function HtmlWebpackPlaceAssetsPlugin(options) {
  this.options = options;
}

HtmlWebpackPlaceAssetsPlugin.prototype.apply = function(compiler) {
  var self = this;

  // Hook into the html-webpack-plugin processing
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-before-html-processing', function (pluginArgs, callback) {
      var headRegExp = self.options.headReplaceExp;
      var bodyRegExp = self.options.bodyReplaceExp;
      var tagsJoin = self.options.tagsJoin || '\n';
      var assetTags = pluginArgs.plugin.generateAssetTags(pluginArgs.assets);
      var body = assetTags.body.map(pluginArgs.plugin.createHtmlTag);
      var head = assetTags.head.map(pluginArgs.plugin.createHtmlTag);
      var html = pluginArgs.html;

      if (body.length) {
        html = html.replace(bodyRegExp, function (match) {
          return body.join(tagsJoin);
        });
      }

      if (head.length) {
        html = html.replace(headRegExp, function (match) {
          return head.join(tagsJoin);
        });
      }

      pluginArgs.html = html;

      callback(null, pluginArgs);
    });
  });
}

module.exports = HtmlWebpackPlaceAssetsPlugin;
