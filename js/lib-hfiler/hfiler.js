/**
 * Created by Hekx on 16/1/29.
 */
;(function(window,factory){
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return factory.call(window);
        });
    }
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory.call(window);
    } else {
        window.hupload = factory.call(window);
    }

}(typeof global === 'object' ? global : window, function(){
    'use strict';

}));