/**
 * Created by Hekx on 15/12/14.
 */
(function(window,factory){
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

}(typeof global === 'object' ? global : window, function(){
    'use strict';

    var hrollover;

    var $ut = {
        node : function(){
            var arg = Array.prototype.slice.call(arguments);
            if(arg.length === 1 && typeof arg[0] === 'string'){
                return document.getElementById(arg[0]);
            }
        },
        addEvent : function(el,type,fn,bubble){
            var _fn = function(e){
                fn.call(el,e);
            };
            if(el.addEventListener){
                el.addEventListener(type,fn,!!bubble);
            }else if(el.attachEvent){
                el.attachEvent('on' + type ,_fn);
            }
            return _fn;
        },
        bind : function(self,fn){
            return function (){
                fn.apply(self,arguments);
            }
        },
        hasClass : function(el,klass){
            return !!el.className.match(new RegExp("(\\s|^)" + klass + "(\\s|$)"));
        },
        delClass : function(el,klass){
            if(this.hasClass(el,klass)){
                el.className = el.className.replace(new RegExp("(\\s|^)" + klass + "(\\s|$)" ),"");
            }
        }
    };

    var Hrollover = function(opts){
        return new Hrollover.fn.roll(opts);
    };
    Hrollover.fn = Hrollover.prototype;

    var roll = Hrollover.fn.roll = function(opts){
        opts = opts || {};
        this.configs = {
            element      : '',
            type         : '',
            offset       : 50,
            cssAnimation : []
        };
        for(var i in opts){
            if(opts.hasOwnProperty(i)){
                this.configs[i] = opts[i];
            }
        }
        if(this.configs.element !== '')this._init();
    };
    roll.prototype = Hrollover.fn;

    Hrollover.fn.copy = function(source,traget){
        for(var i in traget){
            source[i] = traget[i];
        }
        return source;
    };
    var methodsRoll = {
        _count: 0,
        _init : function(){
            console.log('init');
            var self = this,
                bindScrollFn = $ut.bind(self,self._scrollFn);
            this._element().setAttribute('data-hscroll',false);
            this._bindScrollEvent(bindScrollFn);
        },
        _element : function(){
            return $ut.node(this.configs.element);
        },
        _bindScrollEvent : function(fn){
            $ut.addEvent(window,'scroll',fn);
        },
        _scrollFn : function(){
            var top = document.body.scrollTop || document.documentElement.scrollTop,
                element = this._element();
            if(top >= this.configs.offset && this._count === 0 && this.configs.type === ''){
                this._setScroll(element);
                this._count++;
                console.log('in' + ':' + this._count);
            }else{
                if(top <= this.configs.offset && this._count === 1 && this.configs.type === ''){
                    this._setScroll(element);
                    this._count--;
                    console.log('out' + ':' + this._count);
                }
            }
        },
        _setScroll : function(el){
            var derail = el.getAttribute('data-hscroll');
            if(this.configs.cssAnimation.length !== 0){
                if(!$ut.hasClass(el,this.configs.cssAnimation[0]) && derail === 'false'){
                    if($ut.hasClass(el,this.configs.cssAnimation[1])){
                        $ut.delClass(el,this.configs.cssAnimation[1]);
                    }
                    el.className += ' ' + this.configs.cssAnimation[0];
                }else{
                    if(derail === 'true' && this.configs.cssAnimation.length > 1){
                        if(!$ut.hasClass(el,this.configs.cssAnimation[1])){
                            $ut.delClass(el,this.configs.cssAnimation[0]);
                        }
                        el.className += ' ' + this.configs.cssAnimation[1];
                    }else{
                        $ut.delClass(el,this.configs.cssAnimation[0]);
                    }
                }

            }else{
                if(derail === 'false'){
                    el.style['position'] = 'fixed';
                    el.style['top']      =  0;
                    el.setAttribute('data-hscroll',true);
                }else{
                    if(derail === 'true'){
                        el.removeAttribute('style');
                        el.setAttribute('data-hscroll',false);
                    }
                }
            }
        },
        _setCssScrollDown : function(el){
            //todo
        }
    };
    Hrollover.fn.copy(roll.prototype,methodsRoll);
    hrollover = {
        init : function(opts){
            Hrollover(opts);
        }
    };
    return hrollover;
}));