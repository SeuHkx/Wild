/**
 * Created by Hekx on 15/12/28.
 */
;(function (window, factory) {
    'use strict';

    if (typeof define === 'function' && typeof define.amd) {
        define([], function () {
            return factory.call(window);
        });
    }
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory.call(window);
    } else {
        window.hdrag = factory.call(window, document);
    }

}(typeof global === 'object' ? global : window, function (doc) {
    'use strict';

    var HDrag = function (id,opts) {
        return new HDrag.fn.init(id,opts);
    };

    HDrag.fn = HDrag.prototype;

    var init = HDrag.fn.init = function (id,opts) {
            var arg  = [].slice.call(arguments),
                cfgs = {
                    elements : '',
                    statics  : true,
                    sort   : true,
                    finish : null
                };
            this.opts= HDrag.utils.extend({},cfgs);
            for(var i in opts){
                if(this.opts.hasOwnProperty(i)){
                    this.opts[i] = opts[i];
                }
            }
            this.collection = {};
            this.dragElementsTransformFlag = false;
            this.element = null;
            this.wrapper = typeof arg[0] === 'string' ? HDrag.utils.node(id) : doc;
            if(typeof arg[1] !== 'undefined' || typeof arg[0] === 'object')this._drag();
        },
        methodsDrags = {
            _drag : function(){
                this._dragBindEvent();
            },
            _dragBindEvent: function(){
                var self = this,
                    __dragElementsDown = HDrag.utils.bindFn(self,self._dragElementsDown),
                    __dragElementsUp   = HDrag.utils.bindFn(self,self._dragElementsUp);
                HDrag.utils.addEvent(this.wrapper,'mousedown',__dragElementsDown);
                HDrag.utils.addEvent(doc,'mouseup',__dragElementsUp);
            },
            _dragElementsDown : function(e){
                var event   = event || e,
                    self    = this,
                    config  = {
                        event   : event || e,
                        target  : event.target || event.srcElement,
                        elements: self.wrapper,
                        classes : '',
                        reg     : new RegExp("\\b" + self.opts.elements +"\\b([^-]|$)","g"),
                        self    : self
                };
                HDrag.utils.on(config,function(element,event){
                    var __dragElementsMove = HDrag.utils.bindFn(this,this._dragElementsMove);
                    this.element = element;
                    this.collection.startX = event.clientX;
                    this.collection.startY = event.clientY;
                    this._dragElementsPlaceholderAttr();
                    HDrag.utils.addEvent(doc,'mousemove',__dragElementsMove);
                    HDrag.utils.addEvent(doc,'mouseup',function(){
                        HDrag.utils.removeEvent(doc,'mousemove',__dragElementsMove);
                        HDrag.utils.removeEvent(doc,'mouseup',  __dragElementsMove);
                    })
                });
                event.stopPropagation();
            },
            _dragElementsUp: function(){
                if(this.dragElementsTransformFlag){
                    this.dragElementsTransformFlag = false;
                    this._dragElementsReduction();
                    //todo
                    this.opts.finish && this.opts.finish();
                }
                this.collection.placeholder = null;
            },
            _dragElementsMove: function(event){
                if(!this.dragElementsTransformFlag){
                    this.dragElementsTransformFlag = true;
                    this._dragElementsTransform();
                    this._dragElementsPlaceholder();
                }
                //todo
                this.element.style['left'] = this.collection.left + event.clientX - this.collection.startX + 'px';
                this.element.style['top']  = this.collection.top  + event.clientY - this.collection.startY + 'px';
            },
            _dragElementsTransform: function(){
                var margin = HDrag.utils.getStyle(this.element,'marginLeft').replace(/px/gi,'');
                this.element.style['position'] = 'absolute';
                this.element.style['zIndex']   = '99999999';
                this.element.style['left']     = parseInt(-margin) + this.element.offsetLeft + 'px';
                this.element.style['top']      = this.element.offsetTop + 'px';
                this.collection.left = parseInt(-margin) + this.element.offsetLeft;
                this.collection.top  = this.element.offsetTop;
            },
            _dragElementsPlaceholderAttr : function(){
                var margin = parseInt(HDrag.utils.getStyle(this.element,'marginTop').replace(/px/gi,'')) + parseInt(HDrag.utils.getStyle(this.element,'marginBottom').replace(/px/gi,''));
                this.collection.placeholder = HDrag.utils.createNode('div');
                this.collection.placeholder.style['height'] = this.element.offsetHeight + margin + 'px';
            },
            _dragElementsPlaceholder:function(){
                //todo
                if(this.element.parentNode.children.length === 1){
                    this.element.parentNode.appendChild(this.collection.placeholder)
                }else{
                    this.element.parentNode.insertBefore(this.collection.placeholder,this.element.nextSibling);
                }

            },
            _dragElementsReduction: function(){
                this.element.removeAttribute('style');
                this.element.parentNode.removeChild(this.collection.placeholder);
            }
        };
    HDrag.utils = {
        addEvent : function (el, type, fn, bubble) {
            if (el.addEventListener) {
                el.addEventListener(type, fn, !!bubble);
            } else if (el.attachEvent) {
                el.attachEvent('on' + type, fn);
            }
        },
        removeEvent:function (el, type, fn, bubble) {
            if (el.removeEventListener) {
                el.removeEventListener(type, fn, !!bubble);
            }
            else if (el.detachEvent) {
                el.detachEvent('on' + type, fn);
            }
        },
        bindFn: function (self,fn) {
            return function () {
                return fn.apply(self, arguments);
            }
        },
        on : function(config,fn){
            while (config.target != config.element){
                config.classes = config.reg.exec(config.target.className);
                if(config.classes !== null && config.classes[0]){
                    fn.call(config.self,config.target,config.event);
                }
                config.target = config.target.parentNode;
            }
        },
        extend: function () {
            var arg = [].slice.call(arguments);
            if (typeof arg[0] !== 'object') return arg[0];
            for (var attr in arg[1]) {
                arg[0][attr] = typeof arg[1][attr] === 'object' ? this.extend(arg[1][attr]) : arg[1][attr];
            }
            return arg[0];
        },
        node: function(){
            var arg = arguments[0];
            if (arguments.length === 1 && typeof arg === 'string') {
                return doc.getElementById(arg);
            }
        },
        createNode : function (node) {
            if (node) {
                return doc.createElement(node);
            }
        },
        getStyle : function(el,attr){
            if (el.currentStyle){
                return el.currentStyle[attr];
            }else if (window.getComputedStyle){
                return window.getComputedStyle(el,null)[attr];
            }
        }
    };
    HDrag.utils.extend(HDrag.fn, methodsDrags);
    init.prototype = HDrag.fn;

    return HDrag;
}));