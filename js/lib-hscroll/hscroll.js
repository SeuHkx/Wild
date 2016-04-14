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
            transition : false,
            show: true,
            emit: null
        },
            height;
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
        this.hscroll   = HScroll.utils.node(id) === null ? doc.body : HScroll.utils.node(id);
        this.scroll    = this.opts.scroll === '' ? this.hscroll.children[0] : HScroll.utils.node(this.opts.scroll);
        this.scrollBar = HScroll.utils.createNode('div');
        this.coordinate= {};
        typeof this.opts.height === 'string' ? height = window.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight : height = this.opts.height;
        if(height >= this.scroll.offsetHeight)this.scrollBar.style['visibility'] = 'hidden';
        this.opts.height && this._resizeTemplateSlider();
        this._init();
    };
    var  methodsScroll = {
        _init : function(){
            this._setScrollBar();
            this._dragScrollSlider()._scrollWheel();
            if(!this.opts.show)this._sliderBindShow();
        },
        _setScrollBar : function(){
            var self    = this,
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
            if(self.opts.transition)this._setScrollTransition();
            this.coordinate.scrollHeight = this.scroll.offsetHeight;
            this.scrollBar.className = self.opts.bar.classes;
            for (var attr in style)this.scrollBar.style[attr] = style[attr];
            this.hscroll.style['height']   = typeof self.opts.height === 'string' ? self.opts.height : self.opts.height + 'px';
            this.hscroll.style['overflow'] = 'hidden';
            this.hscroll.style['paddingRight'] =  self.opts.bar.width === 0 ? 1 : self.opts.bar.width*2 + 'px';
            this.hscroll.appendChild(this.scrollBar);
            this._setScrollSlider();
            this.scrollSlider = this.scrollBar.children[0];
            if(self.opts.transition)this._setScrollSliderTransition();

        },
        _setScrollTransition : function () {
            this.scroll.style.webkitTransform = 'translate(0px,0px) translateZ(0px)';
            this.scroll.style.webkitTransitionDuration = '500ms';
            this.scroll.style.webkitTransitionTimingFunction = 'cubic-bezier(0.1, 0.57, 0.1, 1)';
        },
        _setScrollSliderTransition : function () {
            this.scrollSlider.style.webkitTransitionDuration = '500ms';
            this.scrollSlider.style.webkitTransitionTimingFunction = 'cubic-bezier(0.1, 0.57, 0.1, 1)';
            this.scrollSlider.style.webkitTransform = 'translate(0px,0px) translateZ(0px)';
        },
        _setScrollSlider : function () {
            HScroll.utils.html(this.scrollBar,this._templateSlider());
        },
        _templateSlider : function(){
            var tmpl,
                height,
                color,
                __initSliderHeight = HScroll.utils.bindFn(this,this._calculateFormula.initSliderHeight);
            height = this.opts.slider.height === 'auto' ? parseInt(__initSliderHeight(this.opts.height,this.scroll.offsetHeight)) : this.opts.slider.height;
            color  = this.opts.slider.color;
            tmpl   = '<div class="'+ this.opts.slider.classes +'" style="opacity:'+ this.opts.slider.opacity +';height: '+ height +'px;background: '+ color +';width:'+ this.opts.slider.width +'px;position: absolute;left: 50%;z-index:9999;margin-left: '+ -(this.opts.slider.width/2) +'px;filter: progid:DXImageTransform.Microsoft.Alpha(Opacity='+ this.opts.slider.opacity*100 +');"></div>';
            return tmpl;
        },
        _dragScrollSlider : function(){
            var self = this,
                __dragScrollSliderExe = HScroll.utils.bindFn(self,self._dragScrollSliderExe);
            HScroll.utils.addEvent(self.scrollSlider,'mousedown',function(e){
                var event = e || event;
                if(self.opts.transition){
                    if(typeof self.coordinate.distance === 'undefined')self.coordinate.distance = 0;
                    self.coordinate.startY = event.clientY - self.coordinate.distance;
                }else{
                    self.coordinate.startY = event.clientY - self.scrollSlider.offsetTop;
                }
                HScroll.utils.addEvent(doc,'mousemove',__dragScrollSliderExe);
                HScroll.utils.addEvent(doc,'mouseup',function(){
                    HScroll.utils.removeEvent(doc,'mousemove',__dragScrollSliderExe);
                    HScroll.utils.removeEvent(doc,'mouseup',  __dragScrollSliderExe);
                });
            });
            return this;
        },
        _dragScrollSliderExe : function(e){
            var event = e || event,
                limitTop = event.clientY - this.coordinate.startY;
            this._scrollExe(limitTop);
        },
        _scrollExe : function(distance){
            var percent,
                optsHeight;
            typeof this.opts.height === 'string' ? optsHeight = window.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight : optsHeight = this.opts.height;
            if(optsHeight >= this.scroll.offsetHeight)return false;
            if (distance < 0) {
                distance = 0;
            } else if (distance > optsHeight - this.scrollSlider.offsetHeight) {
                distance = optsHeight - this.scrollSlider.offsetHeight;
            }

            if(this.opts.emit !== null){
                this.opts.emit.call(this,this,distance,optsHeight - this.scrollSlider.offsetHeight);
            }
            percent = distance / (optsHeight - this.scrollSlider.offsetHeight);

            this.opts.transition ? this.scrollSlider.style.webkitTransform = 'translate(0px,'+ distance +'px) translateZ(0px)' : this.scrollSlider.style.top = distance + 'px';
            this.opts.transition ? this.scroll.style.webkitTransform = 'translate(0px,'+ -(this.scroll.offsetHeight - this.hscroll.offsetHeight) * percent +'px) translateZ(0px)' : this.scroll.style.top = -(this.scroll.offsetHeight - this.hscroll.offsetHeight) * percent + 'px';

            this.coordinate.distance      = distance;
            this.coordinate.optsHeight    = optsHeight - this.scrollSlider.offsetHeight;
            this.coordinate.scrollTop     = this.opts.transition ? -(this.scroll.offsetHeight - this.hscroll.offsetHeight) * percent : HScroll.utils.getStyle(this.scroll, 'top').replace(/px/g,'');
        },
        _sliderBindShow : function(){
            //todo show
            var self = this;
            this.hscroll.style['paddingRight'] = '0';
            this.scrollBar.style['width'] = '0';
            this.scrollBar.style['right'] = '0';
            this.scrollSlider.style['marginLeft'] = '0';
            this.scrollSlider.style['left']    = -this.opts.slider.width + 'px';
            this.scrollSlider.style['opacity'] = '0';
            HScroll.utils.addEvent(this.hscroll,'mouseover',function () {
                self.scrollSlider.style.opacity = '1';
            });
            HScroll.utils.addEvent(this.hscroll,'mouseout',function () {
                self.scrollSlider.style.opacity = '0';
            });
        },
        _resizeTemplateSlider : function(){
            var self = this,
                __resizeTemplateUpdateSlider = HScroll.utils.bindFn(self,self._resizeTemplateUpdateSlider);
            HScroll.utils.addEvent(window,'resize',HScroll.utils.delayResize(__resizeTemplateUpdateSlider,self));
        },
        _resizeTemplateUpdateSlider : function(){
            var self = this;
            var scrollTop;
            var uDiff     = self.scroll.offsetHeight - self.hscroll.offsetHeight;
            var H         = self.hscroll.offsetHeight;
            var uSlider   = self._calculateFormula.initSliderHeight(self.opts.height,self.scroll.offsetHeight);
            var height;

            typeof self.opts.height === 'string' ? height = window.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight : height = self.opts.height;
            if(typeof self.opts.height === 'string'){
                uSlider = self._calculateFormula.initSliderHeight(height,self.scroll.offsetHeight);
                scrollTop = self.opts.transition ?  self.coordinate.scrollTop : HScroll.utils.getStyle(self.scroll, 'top').replace(/px/g,'');
                self._resizeUpdateReset(scrollTop,uDiff,H,uSlider);
            }
            if(height >= self.scroll.offsetHeight){
                self.scrollBar.style['visibility'] = 'hidden';
                self.opts.transition ? self.scroll.style.webkitTransform = 'translate(0px,0px) translateZ(0px)' : self.scroll.style['top'] = 0;
                return false;
            }
            self.scrollBar.style['visibility'] = 'visible';
            if(self.scroll.offsetHeight > self.coordinate.scrollHeight){
                scrollTop = self.opts.transition ?  self.coordinate.scrollTop : HScroll.utils.getStyle(self.scroll, 'top').replace(/px/g,'');
                self._resizeUpdateReset(scrollTop,uDiff,H,uSlider);
            }else if(self.scroll.offsetHeight < self.coordinate.scrollHeight){
                if(self.opts.transition){
                    self.scroll.style.webkitTransform = 'translate(0px,'+ -(self.scroll.offsetHeight - self.hscroll.offsetHeight) * (self.coordinate.distance / self.coordinate.optsHeight) +'px) translateZ(0px)';
                    self._resizeUpdateReset(-(self.scroll.offsetHeight - self.hscroll.offsetHeight) * (self.coordinate.distance / self.coordinate.optsHeight),uDiff,H,uSlider);
                }else{
                    self.scroll.style.top = -(self.scroll.offsetHeight - self.hscroll.offsetHeight) * (self.coordinate.distance / self.coordinate.optsHeight) + 'px';
                    self._resizeUpdateReset(HScroll.utils.getStyle(self.scroll, 'top').replace(/px/g,''),uDiff,H,uSlider);
                }
            }
            self.coordinate.scrollHeight = self.scroll.offsetHeight;
        },
        _resizeUpdateReset:function (scrollTop,uDiff,H,uSlider) {
            var uDist = this._calculateFormula.updateSlider(scrollTop,uDiff,H,uSlider);
            this.scrollSlider.style.height = this._calculateFormula.initSliderHeight(this.opts.height,this.scroll.offsetHeight) + 'px';
            this.opts.transition ? this.scrollSlider.style.webkitTransform = 'translate(0px,'+ -uDist +'px) translateZ(0px)' : this.scrollSlider.style.top = -uDist + 'px';
            this.coordinate.distance = -uDist;
        },
        _calculateFormula :{
            initSliderHeight : function(H,nowH){
                if(typeof H === 'string')H = window.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight;
                return Math.round((H/(nowH)) * H);
            },
            updateSlider : function(scrollTop,uDiff,H,uSlider){
                var distance;
                distance = scrollTop/uDiff*(H-uSlider);
                return isNaN(distance) ? 0 : distance;
            }
        },
        _scrollWheel: function(){
            var self = this;
            HScroll.utils.addEvent(self.scroll, 'mousewheel', HScroll.utils.bindFn(self,self._mouseWheel));
            HScroll.utils.addEvent(self.scroll, 'DOMMouseScroll', HScroll.utils.bindFn(self,self._mouseWheel));
        },
        _mouseWheel : function(e){
            if(this.opts.transition && typeof this.coordinate.distance === 'undefined')this.coordinate.distance = 0;
            var event = e || event,
                wheelEventDown = event.wheelDelta ? event.wheelDelta < 0 : event.detail > 0,
                scrollSliderTop= this.opts.transition ? this.coordinate.distance : this.scrollSlider.offsetTop;
            wheelEventDown ? this._scrollExe(scrollSliderTop+ 16) : this._scrollExe(scrollSliderTop - 16);
            if (event.preventDefault)event.preventDefault();
            return false;
        },
        refresh: function () {
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