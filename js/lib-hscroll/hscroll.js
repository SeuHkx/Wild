/**
 * Created by Hekx on 15/12/14.
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
        window.hscroll = factory.call(window, document);
    }

}(typeof global !== 'object' ? window : global, function (doc) {
    'use strict';

    var ua = (function(){
        var IE = navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE7.0" || navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0";
        return {
            IE : IE
        }
    }());

    var HScroll = function (id,opts) {
            return new HScroll.fn.init(id,opts);
        },
        init;
    HScroll.fn = HScroll.prototype = {
        version: '0.0.1',
        constructor: HScroll
    };

    init = HScroll.fn.init = function (id,opts) {
        var config = {
            scroll: '',
            height: '100%',
            slider: {
                width: 8,
                height: 'auto',
                color: '#2196F3',
                opacity: 1,
                classes: 'hscroll-slider'
            },
            bar: {
                width: 4,
                color: '#2196F3',
                opacity: .3,
                classes: 'hscroll-bar'
            },
            show: true,
            emit: null
        };
        this.opts  = HScroll.utils.extend({},config);
        for (var i in opts) {
            if (this.opts.hasOwnProperty(i)) {
                if (typeof opts[i] === 'object') {
                    for (var k in opts[i]) {
                        if (this.opts[i].hasOwnProperty(k)) {
                            this.opts[i][k] = opts[i][k];
                        }
                    }
                    continue;
                }
                this.opts[i] = opts[i];
            }
        }
        this.opts.bar.color = ua.IE ? this.opts.bar.color : 'rgba(0,0,0,.1)';
        this.wrapper   = HScroll.utils.node(id) === null ? doc.body : HScroll.utils.node(id);
        this.scroll    = this.opts.scroll === '' ? this.wrapper.children[0] : HScroll.utils.node(this.opts.scroll);
        this.scrollBar = HScroll.utils.createNode('div');
        this.coordinate= {};
        this.resize    = null;
        //todo
        var setScrollBar = this._setScrollBar();
        HScroll.utils.html(this.scrollBar,this._templateSlider(setScrollBar.padding));

        this.scrollSlider = this.scrollBar.children[0];
        //todo
        if(typeof this.opts.height === 'string') this._resizeTemplateSlider();

        this._init();
    };
    var  methodsScroll = {
        _init : function(){
            if(!this.opts.show){
                this._sliderBindShow();
            }
            this._dragScrollSlider()._scrollWheel();
        },
        _setScrollBar : function(){
            var self    = this,
                padding = parseInt(HScroll.utils.getStyle(this.wrapper, 'paddingTop')) + parseInt(HScroll.utils.getStyle(this.wrapper, 'paddingBottom')),
                style   = {
                    position: 'absolute',
                    top: 0,
                    cursor: 'default',
                    right : self.opts.slider.width > self.opts.bar.width ? (self.opts.slider.width-self.opts.bar.width)/2 + 'px' : 0,
                    height: '100%',
                    width : self.opts.bar.width + 'px',
                    background: self.opts.bar.color,
                    filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + self.opts.bar.opacity * 100 + ')'
                };
            this.scroll.style.position = 'relative';

            this.scrollBar.className = self.opts.bar.classes;
            for (var attr in style)this.scrollBar.style[attr] = style[attr];
            this.wrapper.style['height']   = typeof self.opts.height === 'string' ? self.opts.height : self.opts.height + 'px';
            this.wrapper.style['overflow'] = 'hidden';
            this.wrapper.style['paddingRight'] =  self.opts.bar.width === 0 ? 1 : self.opts.bar.width + 'px';
            this.wrapper.appendChild(this.scrollBar);
            return {
                padding : padding
            }
        },
        _templateSlider : function(padding){
            var tmpl,
                height,
                color,
                __initSliderHeight = HScroll.utils.bindFn(this,this._calculateFormula.initSliderHeight);
            height = this.opts.slider.height === 'auto' ? parseInt(__initSliderHeight(this.opts.height,this.scroll.offsetHeight + padding)) : this.opts.slider.height;
            color  = this.opts.slider.color;
            tmpl = '<div class="'+ this.opts.slider.classes +'" style="height: '+ height +'px;background: '+ color +';width:'+ this.opts.slider.width +'px;position: absolute;left: 50%;z-index:9999;margin-left: '+ -(this.opts.slider.width/2) +'px;filter: progid:DXImageTransform.Microsoft.Alpha(Opacity='+ this.opts.slider.opacity*100 +');"></div>';
            return tmpl;
        },
        _dragScrollSlider : function(){
            var self = this,
                __dragScrollSliderExe = HScroll.utils.bindFn(self,self._dragScrollSliderExe);
            HScroll.utils.addEvent(self.scrollSlider,'mousedown',function(e){
                var event = e || event;
                self.coordinate.startY = event.clientY - self.scrollSlider.offsetTop;
                HScroll.utils.addEvent(doc,'mousemove',__dragScrollSliderExe);
                HScroll.utils.addEvent(doc,'mouseup',function(){
                    HScroll.utils.removeEvent(doc,'mousemove',__dragScrollSliderExe);
                    HScroll.utils.removeEvent(doc,'mouseup',__dragScrollSliderExe);
                });
            });
            return this;
        },
        _dragScrollSliderExe : function(e){
            var event = e || event,
                limitTop = event.clientY - this.coordinate.startY;
            this.coordinate.endY = limitTop;
            this._scrollExe(limitTop);
        },
        _scrollExe : function(distance){
            var percent,
                optsHeight,
                padding = parseInt(HScroll.utils.getStyle(this.wrapper, 'paddingTop')) + parseInt(HScroll.utils.getStyle(this.wrapper, 'paddingBottom'));
            typeof this.opts.height === 'string' ? optsHeight = window.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight : optsHeight = this.opts.height;
            if (distance < 0) {
                distance = 0;
            } else if (distance > optsHeight - this.scrollSlider.offsetHeight) {
                distance = optsHeight - this.scrollSlider.offsetHeight;
            }

            if(this.opts.emit !== null){
                this.opts.emit.call(this,distance,optsHeight - this.scrollSlider.offsetHeight);
                //this._fresh(this.opts.wrapper);
            }

            percent = distance / (optsHeight - this.scrollSlider.offsetHeight);
            this.scrollSlider.style.top = distance + 'px';
            this.scroll.style.top = -(this.scroll.offsetHeight - this.wrapper.offsetHeight + padding ) * percent + 'px';
            this.coordinate.endY = distance;
        },
        _sliderBindShow : function(){
            //todo show
        },
        _resizeTemplateSlider : function(){
            var self = this,
                __resizeTemplateUpdateSlider = HScroll.utils.bindFn(self,self._resizeTemplateUpdateSlider);
            HScroll.utils.addEvent(window,'resize',HScroll.utils.delayResize(__resizeTemplateUpdateSlider,self));
        },
        _resizeTemplateUpdateSlider : function(){
            //todo update
            var self = this,
                padding = parseInt(HScroll.utils.getStyle(this.wrapper, 'paddingTop')) + parseInt(HScroll.utils.getStyle(this.wrapper, 'paddingBottom'));

            var scrollTop = self.scroll.offsetTop - parseInt(HScroll.utils.getStyle(this.wrapper, 'paddingTop'));
            var uDiff     = self.scroll.offsetHeight - self.wrapper.offsetHeight;
            var H         = self.wrapper.offsetHeight;
            var uSlider   = self._calculateFormula.initSliderHeight(this.opts.height,this.scroll.offsetHeight + padding);

            this.scrollSlider.style.height = this._calculateFormula.initSliderHeight(this.opts.height,this.scroll.offsetHeight + padding) + 'px';

            var uDist = self._calculateFormula.updateSlider(scrollTop,uDiff,H,uSlider);
            self.scrollSlider.style.top = -uDist + 'px';
        },
        _calculateFormula :{
            initSliderHeight : function(H,nowH){
                if(typeof H === 'string')H = window.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight;
                return Math.round((H/(nowH)) * H);
            },
            updateSlider : function(scrollTop,uDiff,H,uSlider){
                var distance;
                distance = scrollTop/uDiff*(H-uSlider);
                return distance;
            }
        },
        _scrollWheel: function(){
            var self = this;
            HScroll.utils.addEvent(self.scroll, 'mousewheel', HScroll.utils.bindFn(self,self._mouseWheel));
            HScroll.utils.addEvent(self.scroll, 'DOMMouseScroll', HScroll.utils.bindFn(self,self._mouseWheel));
        },
        _mouseWheel : function(e){
            var event = e || event,
                wheelEventDown = event.wheelDelta ? event.wheelDelta < 0 : event.detail > 0;
            wheelEventDown ? this._scrollExe(this.scrollSlider.offsetTop + 16) : this._scrollExe(this.scrollSlider.offsetTop - 16);
            if (event.preventDefault)event.preventDefault();
            return false;
        },
        refresh: function () {
            //todo
            this._resizeTemplateUpdateSlider();
        }
    };
    HScroll.utils = {
        addEvent : function (el, type, fn, bubble) {
            if (el.addEventListener) {
                el.addEventListener(type, fn, !!bubble);
            } else if (el.attachEvent) {
                el.attachEvent('on' + type, fn);
            }
        },
        delayResize :function(callback,context){
            if(typeof callback !== 'function') return false;
            context   = context || null;
            var timer = null;
            var fn    = function(){
                callback.apply(context);
            };
            return (function(){
                window.clearTimeout(timer);
                timer = window.setTimeout(fn,300);
            })
        },
        removeEvent:function (el, type, fn, bubble) {
            if (el.removeEventListener) {
                el.removeEventListener(type, fn, !!bubble);
            }
            else if (el.detachEvent) {
                el.detachEvent('on' + type, fn);
            }
        },
        extend: function () {
            var arg = [].slice.call(arguments);
            if (typeof arg[0] !== 'object')return false;
            for (var attr in arg[1]) {
                arg[0][attr] = typeof arg[1][attr] === 'object' ? this.extend(arg[1][attr]) : arg[1][attr];
            }
            return arg[0];
        },
        bindFn: function (self,fn) {
            return function () {
                return fn.apply(self, arguments);
            }
        },
        node : function(){
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
        getStyle: function (el, attr) {
            if (el.currentStyle) {
                return el.currentStyle[attr];
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(el, null)[attr];
            }
        },
        html : function(el,str){
            el.innerHTML = str;
        }
    };
    HScroll.utils.extend(HScroll.fn, methodsScroll);
    init.prototype = HScroll.fn;
    return HScroll;
}));