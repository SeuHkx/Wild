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
                return fn.call(el,e);
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
            top          : 0,
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
        _storage : {
            prev : 0,
            count: 0,
            timer: null
        },
        _init : function(){
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
            var curr = document.body.scrollTop || document.documentElement.scrollTop,
                element = this._element(),
                self = this;
            if(curr >= this.configs.offset && this._storage.count === 0 && this.configs.type === ''){
                this._setScroll(element);
                this._storage.count++;
            }else{
                if(curr <= this.configs.offset && this._storage.count === 1 && this.configs.type === ''){
                    this._setScroll(element);
                    this._storage.count--;
                }
            }
            if(this.configs.type === 'modern' && curr >= this.configs.offset){
                if (curr > this._storage.prev) {
                    console.log('down');
                } else if (curr < this._storage.prev) {
                    console.log('up');
                } else {
                    console.log('===')
                }
                this._storage.timer = setTimeout(function(){
                    self._storage.prev = curr;
                },0)
            }
        },
        _setScroll : function(el){
            var derail = el.getAttribute('data-hscroll');
            if(this.configs.cssAnimation.length !== 0){
                if(!$ut.hasClass(el,this.configs.cssAnimation[0]) && derail === 'false'){
                    if($ut.hasClass(el,this.configs.cssAnimation[1])){
                        $ut.delClass(el,this.configs.cssAnimation[1]);
                    }
                    el.setAttribute('data-hscroll',true);
                    el.className += ' ' + this.configs.cssAnimation[0];
                }else{
                    if(derail === 'true' && this.configs.cssAnimation.length > 1){
                        if(!$ut.hasClass(el,this.configs.cssAnimation[1])){
                            $ut.delClass(el,this.configs.cssAnimation[0]);
                        }
                        el.setAttribute('data-hscroll',false);
                        el.className += ' ' + this.configs.cssAnimation[1];
                    }else{
                        el.setAttribute('data-hscroll',false);
                        $ut.delClass(el,this.configs.cssAnimation[0]);
                    }
                }

            }else{
                if(derail === 'false'){
                    el.style['position'] = 'fixed';
                    el.style['top']      =  this.configs.top + 'px';
                    el.setAttribute('data-hscroll',true);
                }else{
                    if(derail === 'true'){
                        el.removeAttribute('style');
                        el.setAttribute('data-hscroll',false);
                    }
                }
            }
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