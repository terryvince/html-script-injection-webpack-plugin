# html-script-injection-webpack-plugin
solve that htmlWebpackPlugin cannot customize injection point and order of script tag

## install
```command
npm i html-script-injection-webpack-plugin -D
```
## use
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>webchat</title>
  </head>
  <body>
    <div>test page</div>
    <script src="jquery"></script>
    <script type="text/javascript">
        // some code
    </script>
    <!-- All of script tag will be auto injected, include jquery, inline script, script of htmlWebpackPlugin -->
    <!--script-->
    
    <!--script end-->
  </body>
</html>
```

## options
<b>injectPoint</b>: boolean value, true mean to customize injection point of script tag, false mean injection point after body. htmlScriptInjectionWebpackPlugin 
will ensure that the script tag of inline is located in the end.

## example
```javascript
// webpack.config.js
const htmlWebpackPlugin = require('html-webpack-plugin');
const htmlInjectionPlugin = require('html-script-injection-webpack-plugin');

module.exports = {
  mode: 'production',

  output: path.resolve(__dirname, '../dist'),
  
  plugins:[
    new htmlWebpackPlugin({
                filename: filename,
                template: resolve(src, filename),
                inject: true
            }),
    new htmlInjectionPlugin({injectPoint:true})  // use after htmlWebpackPlugin
    ]
};
```
