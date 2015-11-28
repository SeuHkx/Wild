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
        eventClick : function(el,fn,index,bubble){
            if (el.addEventListener) {
                el.addEventListener('click',fn,!!bubble);
            }
            else if (el.attachEvent) {
                el.attachEvent('onclick', fn);
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
            filter   : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=40)',
            zIndex   : '9999'
        },
        parentBox : {
            position : 'fixed',
            left     : '50%',
            top      : '25%',
            width    : function(w){
                return w || 300 + 'px';
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
                    btn += '<a id="test" class="hbox-btn wd-button wd-button-flat wd-button--green">'+ btns[i] +'</a>'
                }
                return '<div class='+ configStyle.style.footer +'>'+ btn +'</div>';
            }
        },
        iframe  : function(url){
            return '<div class='+ configStyle.style.content +'><iframe src=' + url + ' width="100%" height="100%">'+'</iframe></div>';
        }
    };
    var HBox = function(opts){
        return new HBox.fn.init(opts);
    };
    HBox.fn = HBox.prototype;

    var init = HBox.fn.init = function(opts){
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
        for (var i in opts){
            if(this.configs.hasOwnProperty(i)){
                this.configs[i] = opts[i];
            }
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
        _setParentBox : function(){
            this.configs.id !== '' ? configStyle.ID = this.configs.id : configStyle.ID =  configStyle.style.parent + configStyle.count;
            if( configStyle.count > 0 && this.configs.repeat !== true){
                configStyle.count = 1;
                return;
            }
            configStyle.count++;
            this.parent = utils.createNode('div');
            for (var s in configStyle.parentBox){
                if(typeof configStyle.parentBox[s] === 'function'){
                    if(this.configs.width !== null && s === 'width'){
                        this.parent.style[s] = parseInt(configStyle.parentBox[s](this.configs.width)) + 'px';
                        this.parent.style.marginLeft = '-' + (this.configs.width)/2 + 'px';
                    }else{
                        this.parent.style[s] = configStyle.parentBox[s]();
                        this.parent.style.marginLeft = '-' + parseInt(configStyle.parentBox[s]())/2 + 'px';
                    }
                    continue;
                }
                this.parent.style[s] = configStyle.parentBox[s];
            }
            this.parent.className = configStyle.style.parent + ' ' + this.configs.cssAnimation[0];
            this.parent.id = configStyle.ID;
            utils.html(this.parent,this._createHtml(this.configs));
            document.body.appendChild(this.parent);
            utils.log(configStyle.count);
        },
        /**
         *
         * @returns {*}
         * @private
         */
        _createShade : function(){
            var shade = utils.createNode('div');
            for(var k in configStyle.shade)shade.style[k] = configStyle.shade[k];
            return shade;
        },
        _createHtml : function(opts){
            var title   = opts.title === ''? templateDom.noTitle:templateDom.title(opts.title);
            var content = opts.iframe !== false ? templateDom.iframe(opts.url) : templateDom.content(opts.content);
            var footer  = templateDom.footer(opts.button);
            var html   = title + content + footer;
            return html;
        },
        _popBox : function(){
            var callArr = [];
            if(this.configs.mask)document.body.appendChild(this._createShade());
            this._setParentBox();
            //
            //callback
            for(var f in this.configs.callback)callArr.push(f);
            if(this.configs.button.length !== 0 && callArr.length === this.configs.button.length){
                for (var i = 0, l = this.configs.button.length; i< l;i += 1){
                    utils.eventClick(document.getElementById('test'),this.configs.callback[callArr[i]],i);
                }
            }
        },
        _closeBox : function(){
            if(this.configs.mask){
                document.body.removeChild(this._createShade());
            }
        }
    };
    HBox.fn.copy(init.prototype,methodsBox);
    hbox = {
        version : '1.0.0',
        open : function(cfg){
            HBox(cfg)._popBox();
        },
        close : function(){
            HBox()._closeBox();
        },
        msg  : function(){
            

        }
    };
    return hbox;
});