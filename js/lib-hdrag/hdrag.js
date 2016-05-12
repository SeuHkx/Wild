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
                    id : '',
                    elements : '',
                    statics  : true,
                    sort   : false,
                    finish : null,
                    move   : null,
                    clone  : false
                };
            this.opts= HDrag.utils.extend({},cfgs);
            this.opts.id = id;
            for(var i in opts){
                if(this.opts.hasOwnProperty(i)){
                    this.opts[i] = opts[i];
                }
            }
            this.collection = {};
            this.dragElementsTransformFlag = false;
            this.element = null;
            this.dragElements = [];
            this.wrapper = typeof arg[0] === 'string' ? HDrag.utils.node(id) : doc;
            if(typeof arg[1] !== 'undefined' || typeof arg[0] === 'object')this._drag();
        },
        methodsDrags = {
            _dragGetElements : function () {
                this.dragElements = HDrag.utils.node(this.opts.id,this.opts.elements);
            },
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
                this.setCapture && this.setCapture();
                return false;
            },
            _dragElementsUp: function(){
                if(this.dragElementsTransformFlag){
                    this.dragElementsTransformFlag = false;
                    this._dragElementsReduction();
                    //todo
                    this.opts.finish && this.opts.finish(this.collection.currElementIndex,this.collection.crashElementIndex,this.collection.direction);
                }
                //this.collection.placeholder = null;
            },
            _dragElementsMove: function(event){
                var clientY = event.clientY - this.collection.startY;
                this._dragGetElements();
                this.collection._lately  = this._dragFindElementsLately(this.element);
                if(!this.dragElementsTransformFlag){
                    this.dragElementsTransformFlag = true;
                    this._dragElementsTransform();
                    this._dragElementsPlaceholder(this.element.nextSibling);
                }
                this.element.style['left'] = this.collection.left + event.clientX - this.collection.startX + 'px';
                this.element.style['top']  = this.collection.top  + event.clientY - this.collection.startY + 'px';
                //todo
               if(clientY > this.collection.currClient){
                   if(this.collection._lately){
                       this._dragElementsPlaceholder(this.collection._lately.nextSibling);
                       this.collection.lately = this.collection._lately;
                       this.collection.direction = 'down';
                   }
               }else if(clientY < this.collection.currClient){
                   if(this.collection._lately){
                       this._dragElementsPlaceholder(this.collection._lately);
                       this.collection.lately = this.collection._lately;
                       this.collection.direction = 'up';
                   }
               }
                this.collection.currClient = clientY;
                this.opts.move  && this.opts.move();
                window.getSelection ? window.getSelection().removeAllRanges() : doc.selection.empty();
                this.setCapture && this.setCapture();
            },
            _dragElementsTransform: function(){
                var marginLeft = HDrag.utils.getStyle(this.element,'marginLeft').replace(/px/gi,''),
                    marginTop  = HDrag.utils.getStyle(this.element,'marginTop').replace(/px/gi,'');
                this.element.style['left']     = parseInt(-marginLeft) + this.element.offsetLeft + 'px';
                this.element.style['top']      = parseInt(-marginTop)  + this.element.offsetTop  + 'px';
                this.element.style['position'] = 'absolute';
                this.element.style['zIndex']   = '99999999';
                this.collection.left = parseInt(-marginLeft) + this.element.offsetLeft;
                this.collection.top  = parseInt(-marginTop)  + this.element.offsetTop;
            },
            _dragElementsPlaceholderAttr : function(){
                var margin = parseInt(HDrag.utils.getStyle(this.element,'marginTop').replace(/px/gi,'')) + parseInt(HDrag.utils.getStyle(this.element,'marginBottom').replace(/px/gi,''));
                this.collection.placeholder = HDrag.utils.createNode('div');
                this.collection.placeholder.style['height'] = this.element.offsetHeight + margin + 'px';
            },
            _dragElementsPlaceholder:function(element){
                //todo
                if(this.element.parentNode.children.length === 1){
                    this.element.parentNode.appendChild(this.collection.placeholder)
                }else{
                    this.element.parentNode.insertBefore(this.collection.placeholder,element);
                }
            },
            _dragElementsReduction: function(){
                this.element.removeAttribute('style');
                this.element.parentNode.removeChild(this.collection.placeholder);
                //todo
                if(this.collection.direction === 'down'){
                    if(this.collection.lately){
                        var currElement = this.element.cloneNode(true);
                        this.element.parentNode.removeChild(this.element);
                        this.collection.lately.parentNode.insertBefore(currElement, this.collection.lately.nextSibling);
                        this.collection.lately = null;
                    }
                }else if(this.collection.direction === 'up'){
                    if(this.collection.lately){
                        var currElement = this.element.cloneNode(true);
                        this.element.parentNode.removeChild(this.element);
                        this.collection.lately.parentNode.insertBefore(currElement, this.collection.lately);
                        this.collection.lately = null;
                    }
                }
            },
            _dragElementsCrash:function(element,obj){
                var l1 = element.offsetLeft;
                var t1 = element.offsetTop;
                var r1 = element.offsetLeft + element.offsetWidth;
                var b1 = element.offsetTop  + element.offsetHeight;

                var l2 = obj.offsetLeft;
                var t2 = obj.offsetTop;
                var r2 = obj.offsetLeft + obj.offsetWidth;
                var b2 = obj.offsetTop  + obj.offsetHeight;
                if(r1<l2||l1>r2||b1<t2||t1>b2){
                    return false;
                }else{
                    return true;
                }
            },
            _dragGetDistance:function (element,obj) {
                var a = (element.offsetLeft + element.offsetWidth /2) -  (obj.offsetLeft + obj.offsetWidth /2);
                var b = (element.offsetTop  + element.offsetHeight/2) -  (obj.offsetTop  + obj.offsetHeight/2);
                return Math.sqrt(a*a + b*b);
            },
            _dragFindElementsLately:function (element) {
                var filterElements = [],
                    allDistance = [],
                    miniElement = null,
                    i = 0;
                for(; i < this.dragElements.length; i += 1){
                    if(this.dragElements[i] === element)this.collection.currElementIndex  = i;
                    if(this.dragElements[i] !== element && this._dragElementsCrash(element,this.dragElements[i])){
                        this.collection.crashElementIndex = i;
                        allDistance.push(this._dragGetDistance(element,this.dragElements[i]));
                        filterElements.push(this.dragElements[i]);
                    }
                }
                for (var j = 0; j < allDistance.length; j += 1) {
                    if(allDistance[j] == Math.min.apply(null, allDistance)){
                        miniElement = filterElements[j];
                    }
                }
                return miniElement;
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
            var arg = [].slice.call(arguments),
                eles= [],
                i   = 0;
            if (arg.length === 1 && typeof arg[0] === 'string') {
                return doc.getElementById(arg[0]);
            }
            if(arguments.length > 1){
                var elements = doc.getElementById(arg[0]).getElementsByTagName('*');
                for(; i < elements.length; i += 1){
                    if(this.hasClass(elements[i],arg[1])){
                        eles.push(elements[i]);
                    }
                }
                return eles;
            }
        },
        createNode : function (node) {
            if (node) {
                return doc.createElement(node);
            }
        },
        hasClass : function(el,klass){
            return !!el.className.match(new RegExp("(\\s|^)" + klass + "(\\s|$)"));
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