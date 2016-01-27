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
        window.hscroll = factory.call(window);
    }

}(typeof global !== 'object' ? window : global, function () {
    'use strict';

    var hscroll,

        saveMemory = {
            scroll       : {},
            slider       : {},
            scrollTarget : {},
            sliderTarget : {},
            opts         : {},
            data         : {}
        },

        doc = document;
    var utils = {
        $bind: function (el, type, fn, bubble) {
            if (el.addEventListener) {
                el.addEventListener(type, fn, !!bubble);
            } else if (el.attachEvent) {
                el.attachEvent('on' + type, fn);
            }
        },
        $unbind: function (el, type, fn, bubble) {
            if (el.removeEventListener) {
                el.removeEventListener(type, fn, !!bubble);
            }
            else if (el.detachEvent) {
                el.detachEvent('on' + type, fn);
            }
        },
        $extend: function () {
            if (typeof arguments[0] != 'object') {
                return arguments[0];
            }
            for (var attr in arguments[1]) {
                arguments[0][attr] = this.$extend(arguments[1][attr]);
            }
            return arguments[0];
        },
        $node: function () {
            var arg = arguments[0];
            if (arguments.length === 1 && typeof arg === 'string') {
                return doc.getElementById(arg);
            }
        },
        $createNode: function (node) {
            if (node) {
                return doc.createElement(node);
            }
        },
        $getStyle: function (el, attr) {
            if (el.currentStyle) {
                return el.currentStyle[attr];
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(el, null)[attr];
            }
        },
        $hasClass: function (el, klass) {
            return !!el.className.match(new RegExp("(\\s|^)" + klass + "(\\s|$)"));
        },
        $class: function (id, klass) {
            var els = [],
                elements = document.getElementById(id).getElementsByTagName('*'),
                i = 0,
                l = elements.length;
            if (arguments.length === 1) {
                return document.getElementById(id);
            }
            for (; i < l; i += 1) {
                if (this.$hasClass(elements[i], klass)) {
                    els.push(elements[i]);
                }
            }
            return els;
        }
    };
    var HScroll = function (opts) {

        var config = {
            wrapper: '',
            scroll: '',
            width: 'auto',
            height: 'auto',
            slider: {
                width: 6,
                height: 'auto',
                color: '#2196F3',
                opacity: 1,
                classes: 'hscroll-slider'
            },
            bar: {
                width: 6,
                color: '#2196F3',
                opacity: .3,
                classes: 'hscroll-bar'
            },
            emit : null
        };
        this.opts = utils.$extend({}, config);

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
        saveMemory.opts[this.opts.wrapper] = utils.$extend({},this.opts);
        saveMemory.data[this.opts.wrapper] = [];

        if(typeof opts === 'undefined')return;

        this.wrapper = utils.$node(this.opts.wrapper);
        this.scroll  = utils.$node(this.opts.scroll);

        saveMemory.scroll[this.opts.wrapper]       = this.scroll.offsetHeight;
        saveMemory.scrollTarget[this.opts.wrapper] = this.scroll;

        if(this.scroll.offsetHeight <= this.opts.height)return;

        this.bar = utils.$createNode('div');
        this.slider = utils.$createNode('div');

        if (this.wrapper !== null)this.init();
    };

    HScroll.fn = HScroll.prototype;

    HScroll.fn.init = function () {

        this._setAttrScroll();

        this._scrollWheel();

        this._dragSlider();

        this._dragBar();

        this._bindEvent();
    };

    HScroll.fn._setAttrScroll = function () {

        var self = this,
            wrapperPadding = parseInt(utils.$getStyle(self.wrapper, 'padding')) * 2,
            style = {
            position: 'absolute',
            top: 0,
            right: 0,
            cursor: 'default',
            height: function (str) {
                var height;
                if (str === 'bar') {
                    return '100%';
                } else {
                    if(self.opts.slider.height === 'auto'){
                       height = parseInt((self.opts.height / (self.scroll.offsetHeight + wrapperPadding)) * self.opts.height);
                        return height;
                    }else{
                        return self.opts.slider.height;
                    }
                }
            },
            width: function (str) {
                if (str === 'bar') {
                    return self.opts.bar.width;
                } else {
                    return self.opts.slider.width;
                }
            },
            opacity: function (str) {
                if (str === 'bar') {
                    return self.opts.bar.opacity;
                } else {
                    return self.opts.slider.opacity;
                }
            },
            filter: function (str) {
                if (str === 'bar') {
                    return 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + self.opts.bar.opacity * 100 + ')';
                } else {
                    return 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + self.opts.slider.opacity * 100 + ')';
                }
            },
            backgroundColor: function (str) {
                if (str === 'bar') {
                    return self.opts.bar.color;
                } else {
                    return self.opts.slider.color;
                }
            }
        };

        for (var i in style) {
            switch (i) {
                case 'width' :
                    this.bar.style[i] = style[i]('bar') + 'px';
                    this.slider.style[i] = style[i]() + 'px';
                    break;
                case 'opacity' :
                    this.bar.style[i] = style[i]('bar');
                    this.slider.style[i] = style[i]();
                    break;
                case 'filter'  :
                    this.bar.style[i] = style[i]('bar');
                    this.slider.style[i] = style[i]();
                    break;
                case 'backgroundColor' :
                    this.bar.style[i] = style[i]('bar');
                    this.slider.style[i] = style[i]();
                    break;
                case 'height' :
                    this.bar.style[i] = style[i]('bar');
                    this.slider.style[i] = style[i]() + 'px';
                    break;
                default :
                    this.bar.style[i] = style[i];
                    this.slider.style[i] = style[i];
                    break;
            }
        }

        this.bar.className = self.opts.bar.classes;
        this.slider.className = self.opts.slider.classes;
        this.slider.style.zIndex = '9999';
        this.wrapper.style['height'] = self.opts.height + 'px';
        this.wrapper.style['position'] = 'relative';
        this.wrapper.style['overflow'] = 'hidden';
        this.wrapper.style['paddingRight'] =  self.opts.bar.width + 'px';
        this.scroll.style['position']  = 'relative';
        this.wrapper.appendChild(this.bar);
        this.wrapper.appendChild(this.slider);

        saveMemory.slider[this.opts.wrapper]       = this.slider.offsetHeight;
        saveMemory.sliderTarget[this.opts.wrapper] = this.slider;
    };

    HScroll.fn._bindEvent   = function(){
        var self = this;
        utils.$bind(self.bar,'click',function(e){
            var event = e || event,
                limitTop = event.clientY - self.slider.offsetHeight - 16;
            self._scrollExe(limitTop);
        });
    };

    HScroll.fn._scrollWheel = function () {
        var self = this;
        utils.$bind(self.scroll, 'mousewheel', self._bindFn(self._mouseWheel));
        utils.$bind(self.scroll, 'DOMMouseScroll', self._bindFn(self._mouseWheel));
    };

    HScroll.fn._dragBar = function () {
        var self = this,
            bar = utils.$class(self.opts.wrapper, self.opts.bar.classes);
        utils.$bind(bar[0], 'mousewheel', self._bindFn(self._mouseWheel));
        utils.$bind(bar[0], 'DOMMouseScroll',self._bindFn(self._mouseWheel));
    };

    HScroll.fn._dragSlider = function () {
        var self = this,
            _bindFn = this._bindFn(this._drag);

        utils.$bind(self.slider, 'mousedown', function (e) {
            var event = e || event;
            self._point.startY = event.clientY - self.slider.offsetTop;
            utils.$bind(doc,'mousemove',_bindFn);
            utils.$bind(doc,'mouseup',function(){
                utils.$unbind(doc,'mousemove',_bindFn);
                utils.$unbind(doc,'mouseup',_bindFn);
            });
        });
        utils.$bind(self.slider,'mousewheel',self._bindFn(self._mouseWheel));
        utils.$bind(self.slider,'DOMMouseScroll',self._bindFn(self._mouseWheel));
    };

    HScroll.fn._point = {
        startY: '',
        endY  : ''
    };

    HScroll.fn._drag = function (e) {
        var event = e || event,
            limitTop = event.clientY - this._point.startY;
        this._point.endY = limitTop;
        this._scrollExe(limitTop);
    };

    HScroll.fn._mouseWheel = function (e) {
        var event = e || event,
            wheelEventDown = event.wheelDelta ? event.wheelDelta < 0 : event.detail > 0;

        if (wheelEventDown) {
            this._scrollExe(this.slider.offsetTop + 16);
        } else {
            this._scrollExe(this.slider.offsetTop - 16);
        }

        if (event.preventDefault) {
            event.preventDefault();
        }
        return false;
    };

    HScroll.fn._scrollExe = function (distance) {
        var percent,
            padding = parseInt(utils.$getStyle(this.wrapper, 'padding')) * 2;
        saveMemory.scroll[this.opts.wrapper] = this.scroll.offsetHeight;

        if (distance < 0) {
            distance = 0;
        } else if (distance > this.opts.height - this.slider.offsetHeight) {
            distance = this.opts.height - this.slider.offsetHeight;
        }

        if(this.opts.emit !== null){
            this.opts.emit.call(this,distance,this.opts.height - this.slider.offsetHeight);
            this._fresh(this.opts.wrapper);
        }

        percent = distance / (this.opts.height - this.slider.offsetHeight);
        this.slider.style.top = distance + 'px';
        this.scroll.style.top = -(this.scroll.offsetHeight - this.wrapper.offsetHeight + padding ) * percent + 'px';
        this._point.endY = distance;
    };

    HScroll.fn._bindFn = function (fn) {
        var self = this;
        return function () {
            return fn.apply(self, arguments);
        }
    };

    HScroll.fn._fresh = function(id){
        var _cacheHeight = saveMemory.scroll[id];

        if(saveMemory.scrollTarget[id].offsetHeight === _cacheHeight){
            return false;
        }
        _cacheHeight = saveMemory.scrollTarget[id].offsetHeight;

        var padding = parseInt(utils.$getStyle(utils.$node(id), 'padding')) * 2,
            sliderHeight = Math.ceil((saveMemory.opts[id].height / (saveMemory.scrollTarget[id].offsetHeight + padding)) * saveMemory.opts[id].height);
        if(saveMemory.opts[id].slider.height === 'auto'){
            saveMemory.sliderTarget[id].style.height = sliderHeight + 'px';
        }

        var sliderDiff   = saveMemory.opts[id].height - saveMemory.slider[id];
        var sliderUpDiff = saveMemory.opts[id].height - saveMemory.sliderTarget[id].offsetHeight;
        var scrollDiff   = saveMemory.scroll[id] - saveMemory.opts[id].height + padding;
        var scrollUpDiff = saveMemory.scrollTarget[id].offsetHeight - saveMemory.opts[id].height + padding;
        saveMemory.data[id].push(sliderUpDiff);
        if(this._point.endY !== sliderDiff && saveMemory.data[id].length > 1){
            sliderDiff =  saveMemory.data[id].shift();
        }
        var sliderTop    = this._formula(this._point.endY,sliderDiff,sliderUpDiff,scrollDiff,scrollUpDiff);
        saveMemory.sliderTarget[id].style.top = Math.ceil(sliderTop) + 'px';
    };

    HScroll.fn._formula = function(c,sliderDiff,sliderUpDiff,scrollDiff,scrollUpDiff){
            var t;
            if(sliderDiff === sliderUpDiff){
                t = c/sliderDiff*scrollDiff/scrollUpDiff*sliderDiff;
                return t;
            }else{
                t = c/sliderDiff*scrollDiff/scrollUpDiff*sliderUpDiff;
                return t;
            }
    };

    hscroll = {
        version: '0.0.1',
        roll: function (opts) {
            return new HScroll(opts);
        },
        fresh : function(id){
            var _fresh;
            _fresh = new HScroll();
            _fresh._fresh(id);

        }
    };
    return hscroll;
}));