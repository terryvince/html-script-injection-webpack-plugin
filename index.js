class HtmlScriptInjection {
    constructor(options) {
        this.options = options || {};
    }
    apply(compiler){
        let isInject = !!this.options.injectPoint;
        compiler.hooks.compilation.tap('HtmlScriptInjection', (compilation)=> {
            let inlineScripts;
            let scriptRule = /(<[\s]*script)[\w,\W]*(<[\s]*\/script[\s]*>)/g;
            let injectRule = /(<!--[\s]*script[\s]*-->)[\w,\W]*(<!--[\s]*script[\s]end[\s]*-->)/g;
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
                'HtmlScriptInjection',
                (data, cb) => {
                    inlineScripts = data.html.match(scriptRule)[0];
                    data.html = data.html.replace(scriptRule,'');
                    cb();
                }
            );

            compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
                'HtmlScriptInjection',
                (data, cb) => {
                    inlineScripts += '</body>';
                    let html = data.html.replace(/<[\s]*\/body[\s]*>/,inlineScripts);
                    let isExistInjectPoint = injectRule.test(data.html);
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

module.exports = HtmlScriptInjection;
