/**
 * Created by Hekx on 16/1/6.
 */
;(function(window,factory){
    'use strict';
    if(typeof define === 'function' && typeof define.amd){
        define([],function(){
            return factory.call(window);
        });
    }
    if(typeof exports === 'object' && typeof module === 'object'){
        module.exports = factory.call(window);
    }else {
        window.hdata = factory.call(window);
    }
}(typeof global === 'object' ? global : window,function(){
    'use strict';
    var HData = function(elem,key,value){
        var arg = [].slice.call(arguments);

        elem = arg[0];

        if(elem.nodeType === 1 && typeof elem === 'object'){

        }
    };
    HData.cacheData = {};
    HData.expando = 'hdata' + ('HData' + Math.random()).replace( /\D/g, "" );
    return HData;
}));