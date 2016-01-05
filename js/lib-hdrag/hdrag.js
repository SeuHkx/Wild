/**
 * Created by Hekx on 15/12/28.
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
        window.hrollover = factory.call(window);
    }

}(typeof global === 'object' ? global : window,function(){
    'use strict'

}));