const toposort = require('toposort');

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
          // Get chunks info as json
          // Note: we're excluding stuff that we don't need to improve toJson serialization speed.
          const chunkOnlyConfig = {
            assets: false,
            cached: false,
            children: false,
            chunks: true,
            chunkModules: false,
            chunkOrigins: false,
            errorDetails: false,
            hash: false,
            modules: false,
            reasons: false,
            source: false,
            timings: false,
            version: false
          };
          const allChunks = compilation.getStats().toJson(chunkOnlyConfig).chunks;
          const optChunks = plugin.options.chunks;
          const chunkGroups = compilation.chunkGroups;
          
          let rstChunks = self.filterAndSortChunks(optChunks, chunkGroups, allChunks);

          return rstChunks;
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

  filterAndSortChunks(optChunks, chunkGroups, allChunks) {
    // sort all chunks
    let edges = [];

    edges = chunkGroups.reduce((result, chunkGroup) => result.concat(
      Array.from(chunkGroup.parentsIterable, parentGroup => [parentGroup, chunkGroup])
    ), []);
    const sortedGroups = toposort.array(chunkGroups, edges);
    // flatten chunkGroup into chunks
    const sortedChunksIds = sortedGroups
      .reduce((result, chunkGroup) => result.concat(chunkGroup.chunks), [])
      .filter((chunk, index, self) => {
        // make sure we have a unique list
        const unique = self.indexOf(chunk) === index;
        return unique;
      })
      .map(chunk => chunk.id);

    // filter and sort result chunks
    let rstChunks = [];
    let allChunksMap = {};

    allChunks.forEach(chunk => {
      allChunksMap[chunk.id] = chunk;
    });

    // filter
    chunkGroups.forEach(group => {
      let chunks = group.chunks;
      let entry = chunks[chunks.length - 1];

      // not match entry chunks
      if (optChunks.indexOf(entry.name) === -1) return;

      rstChunks = rstChunks.concat(group.chunks);
    });

    rstChunks = rstChunks
      // duplicate removal 
      .filter((chunk, index, self) => {
        const unique = self.indexOf(chunk) === index;
        return unique;
      })
      // sort
      .sort((a, b) => {
        let aIndex = sortedChunksIds.indexOf(a.id);
        let bIndex = sortedChunksIds.indexOf(b.id);
        return aIndex - bIndex;
      })
      .map(chunk => allChunksMap[chunk.id]);

    return rstChunks;
  }
}