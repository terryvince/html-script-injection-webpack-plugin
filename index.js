class HtmlScriptInjection {
    constructor(options) {
        this.options = options || {};
    }
    apply(compiler){
        let isInject = !!this.options.injectPoint;
        compiler.hooks.compilation.tap('HtmlScriptInjection', (compilation)=> {
            let inlineScripts = '';
            let scriptRule = /(<script\b[^>]*>([\s\S]*?)<\/script>)/g;
            let injectRule = /(<!--[\s]*script[\s]*-->)[\w,\W]*(<!--[\s]*script[\s]end[\s]*-->)/g;
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
                'HtmlScriptInjection',
                (data, cb) => {
                    inlineScripts = data.html.match(scriptRule) ? data.html.match(scriptRule).join(''): '';
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
                        let allScripts = html.match(scriptRule).join('');
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
