/**
 * Created by Hekx on 15/11/26.
 * support responsive and mobile
 * IE7+,FF,Chrome,Safari.
 */
;(function (window, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return factory.apply(window);
        })
    }
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory.call(window);
    } else {
        window.hbox = factory.call(window);
    }
})(typeof global === 'object' ? global : window, function () {
    'use strict';

    var hbox = hbox || {};

    var utils = {
        client : function(){
            var ua = navigator.userAgent.toLowerCase();
            return {
                mobile : ua.match(/ipad/i) || ua.match(/iphone os/i) || ua.match(/android/i)
            };
        },
        log : function(el){
            if(window.console){
                console.log(el)
            }
        },
        createNode : function(node){
            if(node){
                return document.createElement(node);
            }
        },
        html : function(el,str){
            if(!el.innerHTML){
                el.innerHTML = str;
            }
        },
        append : function(el){
            document.body.appendChild(el);
        },
        remove : function(el){
            document.body.removeChild(el);
        },
        eventClick : function(el,fn,bubble){
            if (el.addEventListener) {
                el.addEventListener('click',fn,!!bubble);
            }
            else if (el.attachEvent) {
                el.attachEvent('onclick', fn);
            }
        },
        $class : function(id,klass){
            var els = [],
                elements = document.getElementById(id).getElementsByTagName('*'),
                i = 0,
                l = elements.length;
            for(; i < l ; i += 1){
                if(elements[i].className === klass){
                    els.push(elements[i]);
                }
            }
            return els;
        },
        getStyle : function(el,attr){
            if (el.currentStyle){
                return el.currentStyle[attr];
            }else if (window.getComputedStyle){
                return window.getComputedStyle(el,null)[attr];
            }
        }
    };
    var configStyle = {
        ID : '',
        count : 0,
        shade : {
            position : 'fixed',
            top      : '0',
            left     : '0',
            width    : '100%',
            height   : '100%',
            backgroundColor : '#000000',
            opacity  : '.4',
            filter   : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=40)'
        },
        parentBox : {
            position : 'fixed',
            left     : '50%',
            top      : '25%',
            width    : function(w){
                return w || 300 + 'px';
            },
            zIndex   : function(index){
                return 9999 + index;
            },
            className: function(klass){
                return klass;
            },
            id       : function(id){
                return id;
            }
        },
        style : {
            parent   : 'hbox',
            title    : 'hbox-title',
            content  : 'hbox-content',
            footer   : 'hbox-footer',
            button   : 'hbox-btn',
            _icon    : 'hbox-close-icon'
        }
    };
    var templateDom = {
        noTitle : '<div  class=' + configStyle.style.title +'><i class='+ configStyle.style._icon +'></i></div>',
        title   : function(str){
            return '<div class='+ configStyle.style.title +'><i class='+ configStyle.style._icon +'></i><h4>'+ str +'</h4></div>';
        },
        content : function(str){
            return '<div class='+ configStyle.style.content +'>'+ str +'</div>'

        },
        footer  : function(btns){
            var btn = '';
            if(btns.length === 0){
                return btn;
            }else {
                for (var i  = 0; i < btns.length; i += 1){
                    btn += '<a class="hbox-btn">'+ btns[i] +'</a>'
                }
                return '<div class='+ configStyle.style.footer +'>'+ btn +'</div>';
            }
        },
        iframe  : function(url){
            return '<div class='+ configStyle.style.content +'><iframe src=' + url + ' width="100%" height="100%">'+'</iframe></div>';
        }
    };
    var cacheData = {
        nodeParent : [],
        nodeShade  : [],
        mask       : null,
        closeCount : 0
    };
    var HBox = function(opts){
        return new HBox.fn.init(opts);
    };
    HBox.fn = HBox.prototype;

    var init = HBox.fn.init = function(opts){
        var arg = Array.prototype.slice.call(arguments);
        this.configs = {
                style    : configStyle.style,
                id       : '',
                title    : '',
                content  : '',
                width    : null,
                height   : null,
                iframe   : false,
                url      : '',
                mask     : true,
                button   : [],
                callback : null,
                cssAnimation : ['pop'],
                repeat   : true
        };
        this.parent = utils.createNode('div');
        for (var i in opts){
            if(this.configs.hasOwnProperty(i)){
                this.configs[i] = opts[i];
            }
        }
        if(typeof arg[0] === 'object'){
            cacheData.mask = this.configs.mask;
        }else{
            cacheData.closeCount++;
        }
        return this;
    };
    init.prototype = HBox.fn;

    HBox.fn.copy = function(source,traget){
        for(var i in traget){
            source[i] = traget[i];
        }
        return source;
    };
    var methodsBox = {
        _setBoxAttr : function(){
            this.configs.id !== '' ? configStyle.ID = this.configs.id : configStyle.ID =  configStyle.style.parent + configStyle.count;
            for (var attr in configStyle.parentBox){
                if(typeof configStyle.parentBox[attr] === 'function'){
                    if(this.configs.width !== null && attr === 'width'){
                        this.parent.style[attr] = parseInt(configStyle.parentBox[attr](this.configs.width)) + 'px';
                        this.parent.style.marginLeft = '-' + (this.configs.width)/2 + 'px';
                    }else{
                        switch (attr){
                            case 'zIndex' :
                                this.parent.style[attr] = configStyle.parentBox[attr](configStyle.count);
                                break;
                            case 'className' :
                                this.parent[attr] = configStyle.parentBox[attr](configStyle.style.parent + ' ' + this.configs.cssAnimation[0]);
                                break;
                            case 'id' :
                                this.parent[attr] = configStyle.parentBox[attr](configStyle.ID);
                                break;
                            default :
                                this.parent.style[attr] = configStyle.parentBox[attr]();
                                this.parent.style.marginLeft = '-' + parseInt(configStyle.parentBox[attr]())/2 + 'px';
                                break;
                        }
                    }
                    continue;
                }
                this.parent.style[attr] = configStyle.parentBox[attr];
            }
            configStyle.count++;
        },
        _createBox : function(){
            this._setBoxAttr();
            utils.html(this.parent,this._createHtml(this.configs));
            utils.append(this.parent);
            if(this.configs.mask){
                utils.append(this._createShade());
            }else {
                cacheData.nodeShade.push('');
            }
            this._closeIcon();
            cacheData.nodeParent.push(this.parent);
        },
        _judge : function(){
            //todo
            if(this.configs.repeat !== true){
                this._createBox();
            }else{
                this._createBox();
            }
        },
        /**
         *
         * @returns {*}
         * @private
         */
        _createShade : function(){
            var shade =  this.shade =  utils.createNode('div');
            for(var k in configStyle.shade)shade.style[k] = configStyle.shade[k];
            cacheData.nodeShade.push(shade);
            return shade;
        },
        _createHtml : function(opts){
            var title   = opts.title === ''? templateDom.noTitle:templateDom.title(opts.title);
            var content = opts.iframe !== false ? templateDom.iframe(opts.url) : templateDom.content(opts.content);
            var footer  = templateDom.footer(opts.button);
            var template  = title + content + footer;
            return template;
        },
        _popBox : function(){
            var fn = [];
            this._judge();
            //callback
            for(var f in this.configs.callback)fn.push(f);
            if(this.configs.button.length !== 0 && fn.length === this.configs.button.length){
                var els = utils.$class(configStyle.ID,configStyle.style.button);
                for (var i = 0, l = this.configs.button.length; i< l;i += 1){
                    utils.eventClick(els[i],this.configs.callback[fn[i]],i);
                }
            }
        },
        _closeIcon : function(){
            var closeIcon = utils.$class(configStyle.ID,configStyle.style._icon),
                that = this;
            utils.eventClick(closeIcon[0],function(){
                utils.remove(that.parent);
                if(that.configs.mask){
                    utils.remove(that.shade);
                }
            });
        },
        _closeBox : function(){
            var nodeParent = cacheData.nodeParent.pop();
            if(cacheData.mask || cacheData.nodeShade.length !== 0){
                var nodeShade  = cacheData.nodeShade.pop();
                if (nodeShade !== ''){
                    utils.remove(nodeShade);
                }
            }
            utils.remove(nodeParent);
        }
    };
    HBox.fn.copy(init.prototype,methodsBox);
    hbox = {
        version : '1.0.0',
        open : function(cfg){
            HBox(cfg)._popBox();
            utils.log('弹一个');
        },
        close : function(){
            HBox()._closeBox();
            utils.log('关闭一个');
        },
        msg  : function(){}
    };
    return hbox;
});