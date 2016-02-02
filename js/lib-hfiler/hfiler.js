/**
 * Created by Hekx on 16/1/29.
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
        window.hfiler = factory.call(window,document);
    }

}(typeof global === 'object' ? global : window, function (doc) {
    'use strict';

    var Hfiler = function(){
        //todo
    };
    Hfiler.utils = {
        extend : function(){
            var arg = [].slice.call(arguments);
            if(arg[0] !== 'object') return arg[0];
            for(var i in arg[1]){
                arg[0][i] = typeof arg[1][i] === 'object' ? this.extend(arg[1][i]) : arg[1][i];
            }
            return arg[0];
        }
    };
    return Hfiler;
}));