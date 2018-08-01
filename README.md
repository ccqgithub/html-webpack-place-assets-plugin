# html-webpack-place-assets-plugin

> Use with [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)。

## Feature 1

 Set option `entry: 'entry.js'` to HtmlWebpackPlugin, HtmlWebpackPlugin will collect all chunks that are the entry's dependence, and inject them into html. 
 
 [This feature is what the html-webpack-plugin will to do](https://github.com/jantimon/html-webpack-plugin/issues/968#issuecomment-398058663).

 ## Feature 2

 Set option `inject: false` to HtmlWebpackPlugin, then the css or js will inject to the placeholder what you set.

## Dependences

html-webpack-place-assets-plugin@4.x:

- [webpack@4.x](https://webpack.js.org/)
- [html-webpack-plugin@3.x](https://github.com/jantimon/html-webpack-plugin)

html-webpack-place-assets-plugin@2.x:

- [webpack@2.x, webpack@3.x](https://webpack.js.org/)
- [html-webpack-plugin@2.x](https://github.com/jantimon/html-webpack-plugin)

## Use and Settings

Add place holders to html:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vue start test</title>
  ${require('./partial/tongji.html')}

  <!-- html-webpack-plugin-css -->

  <style></style>
</head>
<body>
  <img src="../asset/image/test.jpg" alt="">
  <img src="../asset/image/timg.jpeg" alt="">
  <div id="app"></div>

  <!-- html-webpack-plugin-script -->

  <script></script>
</body>
</html>
```

Set `entry: 'entry.js'` and `inject: false` to HtmlWebpackPlugin:

```js
const htmlPlugins = [];
// html files
Object.keys(entries).forEach(key => {
  let item = entries[key];
  let template = './' + templates[item];
  let filename = template.replace(/.*html\/(.*)\.html$/, '$1.html');

  htmlPlugins.push(
    new HtmlWebpackPlugin({
      template: template,
      filename: filename,
      // entry
      entry: item,
      // inject
      inject: false
    })
  );
});

```

Use this plugin:

```js
{
  plugins: [
    new HtmlWebpackPlaceAssetsPlugin({
      // HtmlWebpackPlugin's head tag
      headReplaceExp: /<!-- html-webpack-plugin-css -->/,

      // HtmlWebpackPlugin's body tag
      bodyReplaceExp: /<!-- html-webpack-plugin-script -->/,
      
      // beauty
      tagsJoin: '\n  ',
    })
  ].concat(
    htmlPlugins
  )
}
```