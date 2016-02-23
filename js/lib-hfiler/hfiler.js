/**
 * Created by Hekx on 16/1/29.
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
        window.hfiler = factory.call(window, document);
    }

}(typeof global === 'object' ? global : window, function (doc) {
    'use strict';

    var Hfiler = function (opts) {
        return new Hfiler.fn.hfiler(opts);
    };
    Hfiler.fn = Hfiler.prototype = {
        version: '0.0.1',
        constructor: Hfiler
    };

    var hfiler = Hfiler.fn.hfiler = function (opts) {
        var configs = {
            wrap: '',
            init: null,
            events:{},
            classes : '',
            dataType: 'type',
            typeFlag: 'folder|file',
            dataFlag: /(id|type|name|buttons|properties|url|icon|images|target|empty)/,
            dataField: 'id|type|name|buttons|properties|url|icon|images|target|empty',
            dataDeepFlag: /(name|value|title|url|func|href|target)/
        };
        this.opts = Hfiler.utils.extend({}, configs);
        for (var i in opts) {
            if (this.opts.hasOwnProperty(i)) {
                this.opts[i] = opts[i];
            }
        }

        this.opts.wrap = this.opts.wrap === '' ? doc.body : Hfiler.utils.node(this.opts.wrap);
    };
    var cacheData = {
        data : {}
    };
    var methodsFiler = {
        init: function (data) {
            var dataJson = data,
                filterData,
                divisionData;
            if (!Hfiler.utils.isJSON(data))dataJson = JSON.parse(data);
            filterData = this._filterData(dataJson);
            divisionData = this._divisionData(filterData);
            this._generate(divisionData);
        },
        add:function(){
            //todo
        },
        build: function () {
            Hfiler.utils.insertBefore(this.opts.wrap,this._buildFolderTemplate());
        },
        _buildFolderTemplate: function(){
            var folder = document.createElement('div'),
                folderDom,
                expando= Hfiler.utils.expando('Hfiler');
            folder.className = this.opts.classes;
            folder.setAttribute('id',expando);
            folderDom = '<div class="hfiler-dir hfiler-dir--empty" data-hfiler="hfiler">'
                      +     '<div class="hfiler-dir-name">'
                      +         '<a class="hfiler-dir-name--icon" ></a>'
                      +         '<input type="text" placeholder="新的文件夹" value="新的文件夹">'
                      +     '</div>'
                      +     '<div class="hfiler-dir-create">'
                      +          '<a data-hfiler-buttons="click" data-hfiler-func="Create" data-hfiler-id="'+ expando +'">创建</a>'
                      +          '<a data-hfiler-buttons="click" data-hfiler-func="Cancel" data-hfiler-id="'+ expando +'">取消</a>'
                      +     '</div>'
                      + '</div>';
            folder.innerHTML = folderDom;
            return folder;
        },
        _generate: function (data) {
            var foldersAll = this._templateFile(data).concat(this._templateFolder(data)),
                i = 0;
            for(; i < foldersAll.length; i += 1){
                Hfiler.utils.insertBefore(this.opts.wrap,foldersAll[i]);
            }
            this._templateEvent();
        },
        _divisionData: function (data) {
            //todo
            var checkType = this.opts.typeFlag.split('|'),
                divisionData = {
                    folder: [],
                    file: []
                },
                k = 0,
                j = 0,
                i = 0;
            for (; i < data.length; i += 1) {
                if (data[i][this.opts.dataType] !== null) {
                    if (data[i][this.opts.dataType] === checkType[0]) {
                        divisionData.folder[k++] = data[i];
                    } else {
                        divisionData.file[j++] = data[i];
                    }
                }
            }
            return divisionData;
        },
        _filterData: function (data) {
            var dataStructure = this._dataStructure();
            for (var i = 0; i < data.length; i += 1) {
                for (var attr in data[i]) {
                    if (typeof data[i][attr] === 'object') {
                        for (var j = 0; j < data[i][attr].length; j += 1) {
                            for (var o in data[i][attr][j]) {
                                if (!this.opts.dataDeepFlag.test(o)) {
                                    delete data[i][attr][j][o];
                                }
                            }
                        }
                    }
                    if (!this.opts.dataFlag.test(attr)) {
                        delete data[i][attr];
                    }
                }
                for (var key in dataStructure) {
                    if (typeof data[i][key] === 'undefined') {
                        data[i][key] = null;
                    }
                }
            }
            return data;
        },
        _dataStructure: function () {
            var field = this.opts.dataField.split('|'),
                dataStructure = {},
                i = 0;
            for (; i < field.length; i += 1) {
                dataStructure[field[i]] = null;
            }
            return dataStructure;
        },
        _templateFile: function(data){
            var file,
                wrappers = [],
                wrapper,
                expando,
                i = 0;
            for(; i < data.file.length; i += 1){
                expando = Hfiler.utils.expando('Hfiler');
                wrapper = document.createElement('div');
                wrapper.setAttribute('id',expando);
                if(this.opts.classes !== null){
                    wrapper.className = this.opts.classes;
                }
                file = '<div class="hfiler-file" data-hfiler="hfiler">'+ this._templateCommonDom(data.file[i],expando) +'</div>';
                wrapper.innerHTML = file;
                wrappers[i] = wrapper;
                cacheData.data[expando] = data.file[i];
            }
            return wrappers;
        },
        _templateFolder: function (data) {
            var folder   = '',
                wrappers = [],
                wrapper,
                expando,
                i = 0;
            for (; i < data.folder.length; i += 1) {
                expando= Hfiler.utils.expando('Hfiler');
                wrapper = document.createElement('div');
                wrapper.setAttribute('id',expando);
                if(this.opts.classes !== null){
                    wrapper.className = this.opts.classes;
                }
                if(data.folder[i].empty !== null){
                    if(data.folder[i].empty === false){
                        folder = '<div class="hfiler-dir" data-hfiler="hfiler">'+ this._templateCommonDom(data.folder[i],expando) +'</div>';
                    }else{
                        folder = '<div class="hfiler-dir hfiler-dir--empty" data-hfiler="hfiler">'+ this._templateCommonDom(data.folder[i],expando) +'</div>';
                    }
                }else{
                    folder = '<div class="hfiler-dir hfiler-dir--empty" data-hfiler="hfiler">'+ this._templateCommonDom(data.folder[i],expando) +'</div>';
                }
                wrapper.innerHTML = folder;
                wrappers[i] = wrapper;
                cacheData.data[expando] = data.folder[i];
            }
            return wrappers;
        },
        _templateCommonDom : function(data,id){
            var classes = {
                name : '',
                icon : '',
                link : '',
                tools: ''
            };
            if(data.type === this.opts.typeFlag.split('|')[0]){
                classes.name = 'hfiler-dir-name';
                classes.icon = 'hfiler-dir-name--icon';
                classes.link = 'hfiler-dir-name--link';
                classes.tools= 'hfiler-dir-tools';
                classes.props= 'hfiler-dir-tools--props'
            }else{
                classes.name = 'hfiler-file-name';
                classes.icon = 'hfiler-file-name--icon';
                classes.link = 'hfiler-file-name--link';
                classes.tools= 'hfiler-file-tools';
                classes.props= 'hfiler-dir-tools--props'
            }
            var commonDom  = '<div class="' + classes.name +'">'
                           +    '<a class="'+ classes.icon +'" href="'+ data.url +'" target="'+ data.target +'">'+ this._templateFileIcon(data) +'</a>'
                           +    '<a class="'+ classes.link +'" href="'+ data.url +'" target="'+ data.target +'">'+ data.name +'</a>'
                           + '</div>'
                           + '<div class="'+ classes.tools +'" data-hfiler-tools="tools">'
                           +    '<div class="'+ classes.props +'">'
                           +       ''+ this._templateCommonProp(data) +''
                           +    '</div>'
                           +       ''+ this._templateCommonTools(data,id) +''
                           + '</div>';
            return commonDom;
        },
        _templateCommonTools: function(data,id){
            if(data.buttons === null)return '';
            var folderTools = '',
                i = 0;
            for(; i < data.buttons.length; i += 1){
                typeof data.buttons[i].href === 'undefined' ? data.buttons[i].href = 'javascript:;' : data.buttons[i].href;
                if(typeof data.buttons[i].target !== 'undefined'){
                    folderTools += '<a href="'+ data.buttons[i].href +'" target="'+ data.buttons[i].target +'">'+data.buttons[i].name+'</a>'
                }else{
                    folderTools += '<a href="'+ data.buttons[i].href +'" data-hfiler-buttons="click" data-hfiler-id="'+ id +'" data-hfiler-func="'+ data.buttons[i].func +'">'+data.buttons[i].name+'</a>'
                }
            }
            return folderTools;
        },
        _templateCommonProp: function(data){
            if(data.properties === null)return '';
            var props = '',
                i = 0;
            for(; i < data.properties.length; i += 1){
                props += '<a>'+data.properties[i].name+'<span>'+ data.properties[i].value +'</span></a>'
            }
            if(this._templateFileImg(data) !== '')props += '<a>'+ this._templateFileImg(data) +'</a>';
            return props;
        },
        _templateFileIcon: function(data){
            if(data.icon === null)return '';
            var icon = '';
            icon += '<img src="'+ data.icon +'">';
            return icon;
        },
        _templateFileImg : function(data){
            if(data.images === null)return '';
            var images = '',
                i = 0;
            for(; i < data.images.length; i += 1){
                images += '<img title="'+ data.images[i].title +'" src="'+ data.images[i].url +'">'
            }
            return images;
        },
        _templateEvent: function(){
            var self = this;
            self._templateButtonsEvent();
            Hfiler.utils.event(self.opts.wrap,'mouseover',function(event){
                var e = event || window.event,
                    target = e.target || e.srcElement;
                while(target != self.opts.wrap) {
                    if(target.getAttribute('data-hfiler')=== 'hfiler'){
                        if(target.children[1].getAttribute('data-hfiler-tools')==='tools'){
                            target.children[1].style.display = 'block';
                        }
                    }
                    target = target.parentNode;
                }
            });
            Hfiler.utils.event(this.opts.wrap,'mouseout',function(event){
                var e = event || window.event,
                    target = e.target || e.srcElement;
                while(target != self.opts.wrap) {
                    if(target.getAttribute('data-hfiler')=== 'hfiler'){
                        if(target.children[1].getAttribute('data-hfiler-tools')==='tools'){
                            target.children[1].style.display = 'none';
                        }
                    }
                    target = target.parentNode;
                }
            });
        },
        _templateButtonsEvent: function(){
            var self = this,
                __buttonsEventFn = Hfiler.utils.bind(self,self._buttonsEventFn);
            Hfiler.utils.event(self.opts.wrap,'click',__buttonsEventFn);
        },
        _buttonsEventFn: function(event){
            var e = event || window.event,
                target = e.target || e.srcElement,
                filerNode,
                func,
                dataID;
            if(target.nodeName.toLowerCase() === 'a' && target.getAttribute('data-hfiler-buttons') === 'click'){
                dataID = target.getAttribute('data-hfiler-id');
                filerNode = Hfiler.utils.node(dataID);
                func = target.getAttribute('data-hfiler-func');
                for(var attr in this.opts.events){
                    if(attr === func && typeof this.opts.events[attr] === 'function'){
                        this.opts.events[func](filerNode,cacheData.data[dataID]);
                    }
                }
                if (e && e.preventDefault ){
                    e.preventDefault();
                }
                return false;
            }
        }
    };
    Hfiler.utils = {
        extend: function () {
            var arg = [].slice.call(arguments);
            if (typeof arg[0] !== 'object') return arg[0];
            for (var attr in arg[1]) {
                arg[0][attr] = typeof arg[1][attr] === 'object' ? this.extend(arg[1][attr]) : arg[1][attr];
            }
            return arg[0];
        },
        node: function () {
            if (typeof arguments[0] === 'object')return arguments[0];
            if (typeof arguments[0] === 'string' && arguments.length === 1) {
                return doc.getElementById(arguments[0]);
            }
        },
        insertBefore: function(parent,node){
            if(parent.children.length === 0){
                parent.insertBefore(node,null);
            }
            parent.insertBefore(node,parent.children[0]);
        },
        event: function(el,type,fn){
            if(window.addEventListener){
                el.addEventListener(type,fn,false)
            }else{
                var _fn = function(event){
                    return fn.call(el,event);
                };
                el.attachEvent('on'+type,_fn);
                return _fn;
            }
        },
        bind: function(el,fn){
            return function (){
                fn.apply(el,arguments);
            }
        },
        isJSON: function () {
            var arg = arguments[0],
                _isJSON;
            _isJSON = Object.prototype.toString.call(arg).toLowerCase() === '[object object]' || Object.prototype.toString.call(arg).toLowerCase() === '[object array]';
            return _isJSON;
        },
        expando: function (str) {
            return str + ('Hfiler' + Math.random()).replace(/\D/g, "");
        }
    };
    Hfiler.utils.extend(Hfiler.fn, methodsFiler);

    hfiler.prototype = Hfiler.fn;

    return Hfiler;
}));