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
        replace : function(str){
           return str.replace(/^[^\d]*(\d+)[^\d]*$/, "$1");
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
                el.attachEvent('onclick', function(){
                    fn.apply(el,arguments)
                });
            }
        },
        addEvent  : function(el,type,fn,bubble){
            if (el.addEventListener) {
                el.addEventListener(type,fn,!!bubble);
            }
            else if (el.attachEvent) {
                el.attachEvent('on' + type, fn);
            }
        },
        removeEvent: function(el,type,fn,bubble){
            if (el.removeEventListener) {
                el.removeEventListener(type, fn, !!bubble);
            }
            else if (el.detachEvent) {
                el.detachEvent('on' + type, fn);
            }
        },
        bindFn : function(self,fn){
              return function (){
                  fn.apply(self,arguments);
              }
        },
        $hasClass : function(el,klass){
            return !!el.className.match(new RegExp("(\\s|^)" + klass + "(\\s|$)"));
        },
        $delClass : function(el,klass){
            if(this.$hasClass(el,klass)){
                el.className = el.className.replace(new RegExp( "(\\s|^)" + klass + "(\\s|$)" ),"");
            }
        },
        $class : function(id,klass){
            var els = [],
                elements = document.getElementById(id).getElementsByTagName('*'),
                i = 0,
                l = elements.length;
            if (arguments.length === 1){
                return document.getElementById(id);
            }
            for(; i < l ; i += 1){
                if(this.$hasClass(elements[i],klass)){
                    els.push(elements[i]);
                }
            }
            return els;
        },
        pfxEvent : function(el,type,fn,bubble){
            var pfx = ['webkit','moz','MS','o',''];
            for (var p = 0 ; p < pfx.length; p += 1){
                if(!pfx[p])type.toLowerCase();
                el.addEventListener(pfx[p] + type,fn,!!bubble)
            }
        },
        getStyle : function(el,attr){
            if (el.currentStyle){
                return el.currentStyle[attr];
            }else if (window.getComputedStyle){
                return window.getComputedStyle(el,null)[attr];
            }
        },
        isEmpty : function(obj){
            for (var name in obj){
                return false;
            }
            return true;
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
            opacity  : '0.3',
            filter   : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=30)',
            zIndex   : function(index){
                return 9999997 + index
            }
        },
        parentBox : {
            position : 'fixed',
            left     : '50%',
            top      : '25%',
            width    : function(w){
                return w || 300 + 'px';
            },
            zIndex   : function(index){
                return 9999999 + index;
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
            button   : 'hbox-btn',
            icon     : 'hbox-close-icon'
        }
    };
    var templateDom = {
        noTitle : function(klass){
            return '<div  class=' + klass.title +'><i data-id='+ configStyle.ID +' class='+ klass.icon +'></i></div>'
        },
        title   : function(str,klass){
            return '<div class=' +  klass.title +'><i  data-id='+ configStyle.ID +' class='+ klass.icon +'></i><h4>'+ str +'</h4></div>';
        },
        content : function(str,num,klass){
            var style;
            if(typeof num !== 'string'){
                style = num + 'px';
            }else{
                style = 'auto';
            }
            return '<div class='+ klass.content +' style="height:'+ style +'">'+ str +'</div>'
        },
        footer  : function(btns,klass,arr){
            var btn = '';
            if(btns.length === 0){
                return btn;
            }else {
                if(arr.length === 0 || arr.length !== btns.length){
                    for (var j  = 0; j < btns.length; j += 1){
                        btn += '<a data-id='+ configStyle.ID +' class='+ klass.button +' >'+ btns[j] +'</a>';
                    }
                }else {
                    for (var i  = 0; i < btns.length; i += 1){
                        btn += '<a data-id='+ configStyle.ID +' class="'+ klass.button +' '+ arr[i] +'">'+ btns[i] +'</a>'
                    }
                }
                return '<div class='+ klass.footer +'>'+ btn +'</div>';
            }
        },
        iframe  : function(url,num,klass){
            var style;
            if(typeof num !== 'string'){
                 style = num + 'px';
            }else{
                style = 'auto';
            }
            return '<div class='+ klass.content +' style="height:'+ style +'"><iframe data-id='+ configStyle.ID +' src=' + url + '  frameborder="0" scrolling="auto" width="100%" height="100%">'+'</iframe></div>';
        }
    };
    var cacheData = {
        nodeParent   : {},
        nodeShade    : {},
        mask         : {},
        changeId     : '',
        animateStart : {},
        animateEnd   : {},
        repeat       : {}
    };
    var HBox = function(opts){
        return new HBox.fn.init(opts);
    };
    HBox.fn = HBox.prototype;

    var init = HBox.fn.init = function(opts){
        this.configs = {
                style    : {
                    parent   : 'hbox',
                    title    : 'hbox-title',
                    content  : 'hbox-content',
                    footer   : 'hbox-footer',
                    button   : 'hbox-btn',
                    icon     : 'hbox-close-icon'
                },
                id       : '',
                title    : '',
                content  : '',
                width    : null,
                height   : 'auto',
                iframe   : false,
                url      : '',
                mask     : true,
                maskAnimation : [],
                button   : [],
                buttonClass : [],
                callback : null,
                cssAnimation : [],
                repeat   : true,
                drag     : false,
                init     : null
        };
        this.parent = utils.createNode('div');
        this.shade  = utils.createNode('div');
        this.configs.id !== '' ? this.nextId = this.configs.id : this.nextId =  configStyle.style.parent + configStyle.count;
        for (var i in opts){
            if(this.configs.hasOwnProperty(i)){
                if(i === 'style'){
                    for(var k in opts[i]){
                        if(this.configs[i].hasOwnProperty(k)){
                            this.configs[i][k] = opts[i][k];
                        }
                    }
                    continue;
                }
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
            for (var attr in configStyle.parentBox){
                if(typeof configStyle.parentBox[attr] === 'function'){
                    if(this.configs.width !== null && attr === 'width'){
                        if(utils.client().mobile){
                            this.parent.style[attr]  = '90%';
                            this.parent.style.margin = '0 5%';
                        }else {
                            this.parent.style[attr] = parseInt(configStyle.parentBox[attr](this.configs.width)) + 'px';
                            this.parent.style.marginLeft = '-' + (this.configs.width)/2 + 'px';
                        }
                    }else{
                        switch (attr){
                            case 'zIndex' :
                                this.parent.style[attr] = configStyle.parentBox[attr](configStyle.count);
                                break;
                            case 'className' :
                                this.parent[attr] = configStyle.parentBox[attr](this.configs.style.parent + ' ' + (typeof this.configs.cssAnimation[0] === 'undefined'?'':this.configs.cssAnimation[0]));
                                cacheData.animateStart[configStyle.ID] = this.configs.cssAnimation[0];
                                break;
                            case 'id' :
                                this.parent[attr] = configStyle.parentBox[attr](configStyle.ID);
                                break;
                            default :
                                if(utils.client().mobile){
                                    this.parent.style[attr]  = '90%';
                                    this.parent.style.margin = '0 5%';
                                }else {
                                    this.parent.style[attr] = configStyle.parentBox[attr]();
                                    this.parent.style.marginLeft = '-' + parseInt(configStyle.parentBox[attr]())/2 + 'px';
                                }
                                break;
                        }
                    }
                    continue;
                }
                if(utils.client().mobile){
                    if(attr === 'left'){
                        this.parent.style[attr] = '0';
                        continue;
                    }
                }
                this.parent.style[attr] = configStyle.parentBox[attr];
            }
            configStyle.count++;
        },
        _createBox: function () {
            this._setParentBox();
            utils.html(this.parent, this._createHtml(this.configs));
            utils.append(this.parent);
            if(this.configs.init !== null && typeof this.configs.init === 'function'){
                this.configs.init();
            }
            if (this.configs.mask) {
                utils.append(this._createShade(configStyle.count));
                cacheData.nodeShade[configStyle.ID] = this.shade;
                cacheData.mask[configStyle.ID] = this.configs.mask;
            } else {
                cacheData.mask[configStyle.ID] = this.configs.mask;
            }
            cacheData.nodeParent[configStyle.ID] = this.parent;
            cacheData.changeId = configStyle.ID;
            if(typeof this.configs.cssAnimation[1] !== 'undefined')cacheData.animateEnd[configStyle.ID] = this.configs.cssAnimation[1];
        },
        _dragBox : function(){
            var self = this;
            this._dragCache.title     = utils.bindFn(self,self._dragBindTitle);
            this._dragCache.document = utils.bindFn(self,self._dragBindDocument);
            utils.addEvent(self.parent.children[0],'mousedown',self._dragCache.title);
            utils.addEvent(self.parent.children[0],'mouseup',self._dragCache.document);
        },
        _dragBindTitle : function(e){
            var event = e || event;
            this._dragCache.move = utils.bindFn(this,this._dragBoxMove);
            this._dragTransfer();
            this._dragCache.x = event.clientX;
            this._dragCache.y = event.clientY;
            utils.addEvent(document,'mousemove',this._dragCache.move);
        },
        _dragBoxMove : function(e){
            var self = this;
            var event= e || event;
            var dragBindDocument = utils.bindFn(self,self._dragBindDocument);
            //todo
            this.parent.style['left'] = this._dragCache.left + event.clientX - this._dragCache.x + 'px';
            this.parent.style['top']  = this._dragCache.top  + event.clientY - this._dragCache.y + 'px';
            utils.addEvent(document,'mouseup',dragBindDocument);
        },
        _dragBindDocument : function(){
            var self = this;
            utils.removeEvent(document,'mouseup',self._dragCache.move);
            utils.removeEvent(document,'mousemove',self._dragCache.move);
        },
        _dragTransfer : function(){
            var margin    = utils.getStyle(this.parent,'margin');
            var marginArr = margin.replace(/px/gi,'').split(' ');
            this.parent.style['left'] = parseInt(-marginArr[marginArr.length - 1]) + this.parent.offsetLeft + 'px';
            this.parent.style['top']  = this.parent.offsetTop + 'px';
            this._dragCache.top  = this.parent.offsetTop;
            this._dragCache.left = parseInt(-marginArr[marginArr.length - 1]) + this.parent.offsetLeft;
        },
        _dragCache : {
            document : null,
            title : null,
            move : null,
            x : '',
            y : '',
            top : '',
            left: ''
        },
        _judge : function(){
            //TODO
            this._createBox();
            if(!!this.configs.drag){
                this._dragBox();
            }
            this._closeIcon();
        },
        _createShade : function(opts){
            var shade =  this.shade;
            for(var k in configStyle.shade){
                if(typeof configStyle.shade[k] === 'function'){
                    this.shade.style[k] = configStyle.shade[k](opts);
                    continue;
                }
                this.shade.style[k] = configStyle.shade[k];
            }
            this.shade.className =typeof this.configs.maskAnimation[0] === 'undefined' ? '' : this.configs.maskAnimation[0];
            return shade;
        },
        _createHtml : function(opts){
            var title   = opts.title === ''? templateDom.noTitle(opts.style):templateDom.title(opts.title,opts.style);
            var content = opts.iframe !== false || opts.url !== '' ? templateDom.iframe(opts.url,opts.height,opts.style) : templateDom.content(opts.content,opts.height,opts.style);
            var footer  = templateDom.footer(opts.button,opts.style,opts.buttonClass);
            var template  = title + content + footer;
            return template;
        },
        _popBox : function(){
            var fn = [];
            this._judge();
            for(var f in this.configs.callback)fn.push(f);
            if(this.configs.button.length !== 0 && fn.length === this.configs.button.length){
                var els = utils.$class(configStyle.ID,this.configs.style.button);
                for (var i = 0, l = this.configs.button.length; i< l;i += 1){
                    this._registerCall(els[i],i,fn);
                }
            }
        },
        _registerCall : function(el,index,fn){
            var that = this;
            utils.eventClick(el,function(){
                if(cacheData.changeId !== this.getAttribute('data-id')){
                    cacheData.changeId =  this.getAttribute('data-id');
                }
                that.configs.callback[fn[index]]();
            });
        },
        _closeIcon : function(){
            var closeIcon = utils.$class(configStyle.ID,configStyle.style.icon),
                that = this;
            utils.eventClick(closeIcon[0],function(){
                var dataID  = this.getAttribute('data-id');
                if(typeof cacheData.animateEnd[dataID] !== 'undefined' && window.addEventListener && utils.client().mobile === null) {
                    that._exeIconCss(that,dataID);
                    utils.log('icon close css');
                }else{
                    //todo mobile
                    that._exeIcon(that,dataID);
                    utils.log('icon close normal')
                }
            });
        },
        _exeIconCss: function(slef,id){
            var $el  = utils.$class(id);
            utils.$delClass($el,cacheData.animateStart[id]);
            $el.className += ' ' + cacheData.animateEnd[id];
            utils.pfxEvent($el, 'animationend', function () {
                utils.log('css icon close animationend remove child');
                slef._exeIcon(slef,id);
            });
        },
        _exeIcon   : function(self,id){
            utils.remove(cacheData.nodeParent[id]);
            cacheData.nodeParent[id] = 'undefined';
            if(self.configs.mask){
                utils.remove(cacheData.nodeShade[id]);
                cacheData.nodeShade[id] = 'undefined';
            }
        },
        _shadeDel : function(opt){
            var arg = typeof opt === 'undefined' ? cacheData.changeId : opt;
            if(cacheData.mask[arg] !== false){
                utils.remove(cacheData.nodeShade[arg]);
                cacheData.nodeShade[arg] = 'undefined';
            }
        },
        _exeEventCss: function(slef){
            var $cacheElement = cacheData.nodeParent[cacheData.changeId],
                $cacheStart   = cacheData.animateStart[cacheData.changeId],
                $cacheEnd     = cacheData.animateEnd[cacheData.changeId];
            utils.$delClass($cacheElement,$cacheStart);
            $cacheElement.className += ' ' + $cacheEnd;
            utils.pfxEvent($cacheElement,'animationend',function(){
                utils.log('close box start');
                slef._executive($cacheElement);
            });
            cacheData.nodeParent[cacheData.changeId] = 'undefined';
        },
        _executive : function(opts){
            switch (typeof opts){
                case 'undefined':
                    utils.log('exe deft');
                    utils.log('exe undefined:' + cacheData.nodeParent[cacheData.changeId]);

                    utils.remove(cacheData.nodeParent[cacheData.changeId]);
                    this._shadeDel();
                    cacheData.nodeParent[cacheData.changeId] = 'undefined';
                    break;
                case 'object' :
                    utils.log('exe css animation remove child');
                    utils.log('exe object:' + opts);

                    utils.remove(opts);
                    this._shadeDel();
                    break;
                case 'string':
                    utils.log('exe css animation remove child');
                    utils.log('exe string:' + opts);

                    utils.remove(cacheData.nodeParent[opts]);
                    this._shadeDel(opts);
                    cacheData.nodeParent[opts] = 'undefined';
                    break;
            }
        },
        _closeBox : function(){
            var arg  = arguments[0],
                that = this;
            if(arg !== ''&& typeof arg !== 'undefined') {
                this._executive(arg);
            }
            if(typeof cacheData.animateEnd[cacheData.changeId] !== 'undefined' && window.addEventListener && utils.client().mobile === null){
                this._exeEventCss(that);
            }else{
                //todo mobile
                this._executive();
            }
            utils.log(cacheData.nodeParent);
        }
    };
    HBox.fn.copy(init.prototype,methodsBox);
    hbox = {
        version : '1.0.0',
        open : function(cfg){
            HBox(cfg)._popBox();
        },
        close : function(id){
            HBox()._closeBox(id);
        },
        fn : [],
        register : function(fn){
            if(Object.prototype.toString.call(fn) === '[object Function]'){
                this.fn.push(fn);
                return fn;
            }
        },
        require : function(arg){
            this.fn[0](arg);
        }
    };
    return hbox;
});