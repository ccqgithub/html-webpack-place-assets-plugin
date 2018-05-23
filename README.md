# html-webpack-place-assets-plugin

> 配合 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) 一起使用，用于将assets插入到指定的`placeholder`处。

> 一个`entryJS` => 一个 `template` => 一个 `html-wepack-plugin` 实例。

## 功能

- 支持多页应用，多个入口js，多个页面模板。
- 每个页面只加入对于的入口文件的依赖chunks，而不是将所有chunks都加进去。

## 依赖

html-webpack-place-assets-plugin@2.x:

- [webpack@2.x, webpack@3.x](https://webpack.js.org/)
- [html-webpack-plugin@2.x](https://github.com/jantimon/html-webpack-plugin)

html-webpack-place-assets-plugin@2.x:

- [webpack@4.x](https://webpack.js.org/)
- [html-webpack-plugin@3.x](https://github.com/jantimon/html-webpack-plugin)


## 配置

```js
{
  plugins: [
    new HtmlWebpackPlaceAssetsPlugin({
      // HtmlWebpackPlugin's head tag
      headReplaceExp: /<!-- html-webpack-plugin-css -->/,

      // HtmlWebpackPlugin's body tag
      bodyReplaceExp: /<!-- html-webpack-plugin-script -->/,
      
      // 主要用于美观输出
      tagsJoin: '\n  ',
    })
  ]
}
```

## 使用

- 一个 `entry js` 对应一个 `template`, 对应一个 `htmlWebpackPlugin` 实例.
- `htmlWebpackPlugin` 的 `inject` 设为 `false`.
- `htmlWebpackPlugin` 的 `chunks` 设为 [`entry js`].

## 例子

html:

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

webpack config:

```js
// find entries
const entries = findEntry();
// find template
const templates = findTemplate(entries);

// html webpack instances
const htmlPlugins = [];
// html files
Object.keys(entries).forEach(key => {
  let item = entries[key];
  let template = './' + templates[item];
  let filename = template.replace(/.*src\/html\/(.*)\.html$/, '_view/$1.html');

  htmlPlugins.push(
    new HtmlWebpackPlugin({
      template: template,
      filename: filename,
      // !!
      chunks: [item],
      // !!
      inject: false
    })
  );
});

// html webpack plugin
exportsConfig
  .plugins
  .concat(htmlPlugins)
  // inject assets in html at the replacement
  .concat([
    new PlaceAssetsPlugin({
      headReplaceExp: /<!-- html-webpack-plugin-css -->/,
      bodyReplaceExp: /<!-- html-webpack-plugin-script -->/,
      tagsJoin: '\n  ',
    })
  ])
```

output:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <meta http-equiv="pragma" content="no-cache">
  <meta http-equiv="cache-control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="expires" content="0">

  <link rel="apple-touch-icon" sizes="57x57" href="/fe-site-static/favicon.ico"/>
  <link rel="apple-touch-icon" sizes="114x114" href="/fe-site-static/favicon.ico"/>
  <link rel="apple-touch-icon" sizes="72x72" href="/fe-site-static/favicon.ico"/>
  <link rel="apple-touch-icon" sizes="144x144" href="/fe-site-static/favicon.ico"/>

  <link href="/fe-site-static/favicon.ico" rel="bookmark" type="image/x-icon"/>
  <link href="/fe-site-static/favicon.ico" rel="icon" type="image/x-icon"/>
  <link href="/fe-site-static/favicon.ico" rel="shortcut icon" type="image/x-icon"/>

  <title>
    fe-site
  </title>

  <script>var BaiduTongji={}</script>


  <link href="/fe-site-static/6.c2727c4ca5167dde5e5e.css" rel="stylesheet">
</head>
<body>

  <div id="app"> 
  </div>

  <!-- page config -->
  <script>window.pageConfig=window.pageConfig||{},window.pageConfig.locale="<%= locale.locale %>",window.pageConfig.isUrlWithLocale= <%= locale.use === 'Url' %></script>

  <!-- locale data -->
  <script src="/fe-site-static/<%= locale.locale %>/i18n/localeData.js"></script>

  <script type="text/javascript" src="/fe-site-static/s/js/runtime.c2727c4ca5167dde5e5e.js"></script>
  <script type="text/javascript" src="/fe-site-static/s/js/vendor-rxjs.c2727c4ca5167dde5e5e.js"></script>
  <script type="text/javascript" src="/fe-site-static/s/js/vendor-core.c2727c4ca5167dde5e5e.js"></script>
  <script type="text/javascript" src="/fe-site-static/s/js/vendor.c2727c4ca5167dde5e5e.js"></script>
  <script type="text/javascript" src="/fe-site-static/s/js/vendor-vue.c2727c4ca5167dde5e5e.js"></script>
  <script type="text/javascript" src="/fe-site-static/s/js/src/entry/vue-app.js.c2727c4ca5167dde5e5e.js"></script>
  
</body>
</html>
```
