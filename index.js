class htmlWebpackHackPlugin {
    constructor(options) {
        this.options = options || {};
    }
    apply(compiler){
        let isInject = !!this.options.injectPoint;
        compiler.hooks.compilation.tap('htmlWebpackHackPlugin', (compilation)=> {
            let inlineScripts;
            let scriptRule = /(<[\s]*script)[\w,\W]*(<[\s]*\/script[\s]*>)/g;
            let injectRule = /(<!--[\s]*script[\s]*-->)[\w,\W]*(<!--[\s]*script[\s]end[\s]*-->)/g;
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
                'htmlWebpackHackPlugin',
                (data, cb) => {
                    inlineScripts = data.html.match(scriptRule)[0];
                    data.html = data.html.replace(scriptRule,'');
                    cb();
                }
            );

            compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
                'htmlWebpackHackPlugin',
                (data, cb) => {
                    inlineScripts += '</body>';
                    let html = data.html.replace(/<[\s]*\/body[\s]*>/,inlineScripts);
                    let isExistInjectPoint = injectRule.test(data.html);
                    if(!isInject){
                        data.html = html;
                        cb();
                        return;
                    }
                    if(isInject && isExistInjectPoint){
                        let allScripts = html.match(scriptRule)[0];
                        html = html.replace(scriptRule,'');
                        data.html = html.replace(injectRule, allScripts);
                    } else {
                        data.html = html;
                    }
                    cb();
                }
            );
        });
    }
}

module.exports = htmlWebpackHackPlugin;
