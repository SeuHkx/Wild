/**
 * Created by Hekx on 15/12/14.
 */
;(function(window,factory){
    'use strict';
    if(typeof define === 'function' && define.amd){
        define([],function(){
            return factory.call(window);
        });
    }
    if(typeof exports === 'object' && typeof module === 'object'){
        module.exports = factory.call(window);
    }else {
        window.hscroll = factory.call(window);
    }

}(typeof global !== 'object' ? window : global , function(){
    'use strict';

    var hscroll,

        doc = document;

    var utils = {
            $bind : function(el,type,fn,bubble){
                if(el.addEventListener){
                    el.addEventListener(type,fn,!!bubble);
                }else if(el.attachEvent){
                    el.attachEvent('on'+type,fn);
                }
            },
            $unbind  : function(el,type,fn,bubble){
                if (el.removeEventListener) {
                    el.removeEventListener(type,fn,!!bubble);
                }
                else if (el.detachEvent) {
                    el.detachEvent('on'+type, fn);
                }
            },
            $node    : function(){
                var arg = arguments[0];
                if(arguments.length === 1 && typeof arg === 'string'){
                    return doc.getElementById(arg);
                }
            },
            $createNode  : function(node){
                if(node){
                    return doc.createElement(node);
                }
            },
            $getStyle : function(el,attr){
                if (el.currentStyle){
                    return el.currentStyle[attr];
                }else if (window.getComputedStyle){
                    return window.getComputedStyle(el,null)[attr];
                }
            }
    };
    var config = {
        wrapper : '',
        scroll  : '',
        width   : 'auto',
        height  : 'auto',
        slider  : {
            width   : 6,
            height  : 40,
            color   : '#2196F3',
            opacity : 1,
            classes : 'hscroll-slider'
        },
        bar     : {
            width   : 6,
            color   : '#2196F3',
            opacity : .3,
            classes : 'hscroll-bar'
        }
    };
    var _cache = {
        self   : null
    };
    var HScroll = function(opts){
        this.opts = config;
        _cache.self = this;
        for(var i in opts){
            if(this.opts.hasOwnProperty(i)){
                if(typeof opts[i] === 'object'){
                    for (var k in opts[i]){
                        if(this.opts[i].hasOwnProperty(k)){
                            this.opts[i][k] = opts[i][k];
                        }
                    }
                    continue;
                }
                this.opts[i] = opts[i];
            }
        }
        this.wrapper = utils.$node(this.opts.wrapper);
        this.scroll  = utils.$node(this.opts.scroll);
        this.bar     = utils.$createNode('div');
        this.slider  = utils.$createNode('div');
        if(this.wrapper !== null)this.init();
    };
    HScroll.fn = HScroll.prototype;

    HScroll.fn.init = function(){
        this._setAttrScroll();
        this._scrollWheel();
        this._dragSlider();
    };
    HScroll.fn._setAttrScroll = function(){
        var self = this,
            height;
        var style = {
            position        : 'absolute',
            top             : 0,
            right           : 0,
            cursor          : 'default',
            height          :  function(str){
                if(str === 'bar'){
                    return '100%';
                }else {
                    height = parseInt((self.opts.height/self.scroll.offsetHeight) * self.opts.height);
                    self.opts.slider.height = height;
                    return self.opts.slider.height;
                }
            },
            width           : function(str){
                if(str === 'bar'){
                    return self.opts.bar.width;
                }else {
                    return self.opts.slider.width;
                }
            },
            opacity         : function(str){
                if(str === 'bar'){
                    return self.opts.bar.opacity;
                }else {
                    return self.opts.slider.opacity;
                }
            },
            backgroundColor : function(str){
                if(str === 'bar'){
                    return self.opts.bar.color;
                }else {
                    return self.opts.slider.color;
                }
            }
        };
        for(var i in style){
            switch (i){
                case 'width' :
                    this.bar.style[i]    = style[i]('bar') + 'px';
                    this.slider.style[i] = style[i]() + 'px';
                    break;
                case 'opacity' :
                    this.bar.style[i]    = style[i]('bar');
                    this.slider.style[i] = style[i]();
                    break;
                case 'backgroundColor' :
                    this.bar.style[i]    = style[i]('bar');
                    this.slider.style[i] = style[i]();
                    break;
                case 'height' :
                    this.bar.style[i]    = style[i]('bar');
                    this.slider.style[i] = style[i]() + 'px';
                    break;
                default :
                    this.bar.style[i]    = style[i];
                    this.slider.style[i] = style[i];
                    break;
            }
        }
        this.bar.className    = self.opts.bar.classes;
        this.slider.className = self.opts.slider.classes;
        this.slider.style.zIndex = '9999';
        this.wrapper.style['height']   = self.opts.height + 'px';
        this.wrapper.style['overflow'] = 'hidden';
        this.scroll.style['position']  = 'relative';
        this.wrapper.appendChild(this.bar);
        this.wrapper.appendChild(this.slider);
    };
    HScroll.fn._scrollWheel = function(){
        var self = this;
        utils.$bind(self.scroll,'mousewheel',self._mouseWheel);
        utils.$bind(self.scroll,'DOMMouseScroll',self._mouseWheel);
    };
    HScroll.fn._dragBar = function(){
        //var self = this;
        //utils.$bind(self.bar,'mousewheel',self._mouseWheel);
        //utils.$bind(self.bar,'DOMMouseScroll',self._mouseWheel);
    };
    HScroll.fn._dragSlider = function(){
        var self = this;
        utils.$bind(self.slider,'mousedown',function(e){
            var event = e || event;
            self._point.Y = event.clientY - self.slider.offsetTop;
            //drag
            utils.$bind(doc,'mousemove',self._drag);
            utils.$bind(doc,'mouseup',function(){
                utils.$unbind(doc,'mousemove',self._drag);
                utils.$unbind(doc,'mouseup',self._drag);
            });
        });
        utils.$bind(self.slider,'mousewheel',self._mouseWheel);
        utils.$bind(self.slider,'DOMMouseScroll',self._mouseWheel);
    };
    HScroll.fn._point = {
        Y : ''
    };
    HScroll.fn._drag = function(e){
        var event = e || event,
            limitTop = event.clientY - _cache.self._point.Y;
        _cache.self._scrollExe(limitTop);
    };
    HScroll.fn._mouseWheel = function(e){
        var event = e || event,
            wheelEventDown = event.wheelDelta ? event.wheelDelta < 0 : event.detail>0;
        if(wheelEventDown){
            _cache.self._scrollExe(_cache.self.slider.offsetTop + 16);
        }else{
            _cache.self._scrollExe(_cache.self.slider.offsetTop - 16);
        }
        if(event.preventDefault){
            event.preventDefault();
        }
        return false;
    };
    HScroll.fn._scrollExe = function(distance){
        var percent,
            padding = parseInt(utils.$getStyle(_cache.self.wrapper,'padding'))*2;
        if(distance < 0){
            distance = 0;
        }else if(distance >  _cache.self.opts.height - _cache.self.opts.slider.height){
            distance = _cache.self.opts.height - _cache.self.opts.slider.height;
        }
        percent = distance/(_cache.self.opts.height - _cache.self.opts.slider.height);
        _cache.self.slider.style.top = distance + 'px';
        _cache.self.scroll.style.top = -(_cache.self.scroll.offsetHeight - _cache.self.wrapper.offsetHeight + padding )*percent + 'px';
    };
    hscroll = {
        version : '0.0.1',
        roll    :  function(opts){
            return new HScroll(opts);
        }
    };
    return hscroll;
}));