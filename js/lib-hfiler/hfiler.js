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
            classes : '',
            dataType: 'type',
            typeFlag: 'folder|file',
            dataFlag: /(id|type|name|buttons|properties|url|icon|images|target|empty)/,
            dataField: 'id|type|name|buttons|properties|url|icon|images|target|empty',
            dataDeepFlag: /(name|value|title|url|func)/
        };
        this.opts = Hfiler.utils.extend({}, configs);
        for (var i in opts) {
            if (this.opts.hasOwnProperty(i)) {
                this.opts[i] = opts[i];
            }
        }
        this.opts.wrap = this.opts.wrap === '' ? doc.body : Hfiler.utils.node(this.opts.wrap);
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
        build: function () {
            alert('build');
        },
        _generate: function (data) {
            var foldersAll = this._templateFile(data).concat(this._templateFolder(data)),
                i = 0;
            for(; i < foldersAll.length; i += 1){
                Hfiler.utils.insertBefore(this.opts.wrap,foldersAll[i]);
            }
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
                files = [],
                i = 0;
            for(; i < data.file.length; i += 1){
                file = document.createElement('div');
                file.setAttribute('id',Hfiler.utils.expando('Hfiler'));
                file.className = 'hfiler-file' + ' ' + this.opts.classes;
                file.innerHTML = this._templateCommonDom(data.file[i]);
                files[i] = file;
            }
            return files;
        },
        _templateFolder: function (data) {
            var folder,
                folders = [],
                i = 0;
            for (; i < data.folder.length; i += 1) {
                folder = document.createElement('div');
                folder.setAttribute('id',Hfiler.utils.expando('Hfiler'));
                if(data.folder[i].empty !== null){
                    if(data.folder[i].empty === false){
                        folder.className = 'hfiler-dir' + ' ' + this.opts.classes;
                    }else{
                        folder.className = 'hfiler-dir' + ' ' + 'hfiler-dir--empty' + ' ' + this.opts.classes;
                    }
                }else{
                    folder.className = 'hfiler-dir' + ' ' + 'hfiler-dir--empty' + this.opts.classes;
                }
                folder.innerHTML = this._templateCommonDom(data.folder[i]);
                folders[i] = folder;
            }
            return folders;
        },
        _templateCommonDom : function(data){
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
            }else{
                classes.name = 'hfiler-file-name';
                classes.icon = 'hfiler-file-name--icon';
                classes.link = 'hfiler-file-name--link';
                classes.tools= 'hfiler-file-tools';
            }
            var commonDom  = '<div class="' + classes.name +'">'
                           +    '<a class="'+ classes.icon +'" href="'+ data.url +'" target="'+ data.target +'"></a>'
                           +    '<a class="'+ classes.link +'" href="'+ data.url +'" target="'+ data.target +'">'+ data.name +'</a>'
                           + '</div>'
                           + '<div class="'+ classes.tools +'">'
                           + ''+ this._templateFileImg(data) +''
                           + ''+ this._templateCommonProp(data)  +''
                           + ''+ this._templateCommonTools(data) +''
                           + '</div>';
            return commonDom;
        },
        _templateCommonTools: function(data){
            if(data.buttons === null)return '';
            var folderTools = '',
                i = 0;
            for(; i < data.buttons.length; i += 1){
                folderTools += '<a>'+data.buttons[i].name+'</a>'
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
            return props;
        },
        _templateFileImg : function(data){
            if(data.images === null)return '';
            var images = '',
                i = 0;
            for(; i < data.images.length; i += 1){
                images += '<img title="'+ data.images[i].title +'" url="'+ data.images[i].url +'">'
            }
            return images;
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