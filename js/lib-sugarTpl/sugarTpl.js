/**
 * Created by Hekx on 16/3/1.
 */
;(function (window, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return factory.call(window);
        });
    }
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory.call(window);
    } else {
        window.sugarTpl = factory.call(window, document);
    }

})(typeof global === 'object' ? global : window, function () {
    'use strict';
    var sugarTemplate,
        sugarTemplateSettings = {
            evaluate      : /(\{@)|(@\/\w+\})/g,
            tagStart      : /([^\}]\{@)/g,
            tagClose      : /(\}@\/\w+\})/g,
            tagConnection : /(\})@\/\w+.\{@(\w+)(\{)/g,
            connection    : /\}@\/\w+\}\{@\w+\{/g,
            sentenceStart : /\{@(.\w+.+)/g,
            sentenceEnd   : /\}@\/\w+./g,
            variant       : /\$\{([\s\S]*?)\}/g,
            variantExp    : /^\${|}/g
        },
        SugarTemplate = function (str) {
            if(str === '')return;
            this.template = str.replace(/(^\s+)|(\s+$)/g, '');
        };
    SugarTemplate.fn = SugarTemplate.prototype;

    SugarTemplate.fn.version = '0.0.1';
    /**
     * 
     * @returns {T}
     */
    SugarTemplate.extend = function () {
        var arg = [].slice.call(arguments);
        if (typeof arg[0] !== 'object')return arg[0];
        for (var attr in arg[1]) {
            arg[0][attr] = typeof arg[1][attr] === 'object' ? this.extend(arg[1][attr]) : arg[1][attr];
        }
    };
    /**
     * 
     * @type {{_cache: null, _parser: methodsSugarTpl._parser, compile: methodsSugarTpl.compile}}
     */
    var methodsSugarTpl = {
        _cache: null,
        /**
         * 
         * @param data
         * @returns {*}
         * @private
         */
        _parser: function (data) {
            var templateEngine,
                template,
                exp = sugarTemplateSettings;
            /**
             * 
             * @type {string|XML}
             */
            template = this.template.replace(/\{+\{/g, '{').replace(/\}\}+/g, '}').replace(/\\/g, '\\\\').replace(/(?="|')/g,'\\')
                .replace(exp.tagStart, '";$1')
                .replace(exp.connection,function (code) {
                    code = code.replace(exp.tagConnection,'"$1$2$3');
                    return code + ';sugarBuildTemplate +="';
                })
                .replace(/\{@+/g, ' {@ ')
                .replace(exp.sentenceStart, function (code) {
                    return code.replace(/\\/g, '') + ';sugarBuildTemplate +="';
                })
                .replace(exp.tagClose, '";$1')
                .replace(exp.sentenceEnd, function (code) {
                    return code + ';sugarBuildTemplate +="';
                })
                .replace(exp.evaluate,'')
                .replace(exp.variant, function (code) {
                    code = code.replace(exp.variantExp, '');
                    return '"+' + code.replace(/\\/g, '') + '+"';
                })
                .replace(/[\r\n\t]/g, ' ');

            template = ' "use strict"; var sugarBuildTemplate = "' + template + '"; return sugarBuildTemplate;';
            console.log(template);
            try {
                this._cache = templateEngine = new Function('data', template);
                return templateEngine(data);
            }catch (e){
                return '<h3>SugarTpl Error:</h3><h4 style="color: red;">'+e.message+'</h4>';
            }
        },
        /**
         * 
         * @param data
         * @param callback
         * @returns {*}
         */
        compile: function (data, callback) {
            var result;
            if (this._cache) {
                result = this._cache(data);
            } else {
                result = this._parser(data);
            }
            if (!!callback)callback(result);
            return result;
        }
    };
    SugarTemplate.extend(SugarTemplate.fn, methodsSugarTpl);
    /**
     * 
     * @param str
     * @returns {*}
     */
    sugarTemplate = function (str) {
        if (str === '' || typeof str !== 'string')return false;
        return new SugarTemplate(str);
    };
    return sugarTemplate;
});