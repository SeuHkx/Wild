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
            init: null
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
            var dataJson = data;
            if (!Hfiler.utils.isJSON(data))dataJson = JSON.parse(data);
            this._divisionData(dataJson);
            this._generate(dataJson);
            //console.log(data)
        },
        build: function () {
            alert('build');
        },
        _generate: function (data) {
            var node = this._template(data);
            if (node.length === 1) {
                this.opts.wrap.appendChild(node[0]);
            } else {
                for (var i = 0; i < node.length; i += 1) {
                    this.opts.wrap.appendChild(node[i]);
                }
            }
        },
        _divisionData: function (data) {
            //todo
            var checkType = this.configData.setType.split('/');
            //var checkFolderReg = 'id/name/type/empty/properties/url/buttons';

            for (var i = 0; i < data.length; i += 1) {
                if (data[i].hasOwnProperty(checkType[0])) {
                    if(data[i][checkType[0]] === checkType[1]){
                        //this._filterData(data[i]);

                    }else if(data[i][checkType[0]] === checkType[2]){
                        var filterData = this._filterData(data[i]);
                        console.log(filterData);
                    }
                }
            }

        },
        _filterData : function(data){
            for(var attr in data){
                if(!this.configData.setData.test(attr)){
                    delete data[attr];
                }
            }
            return data;
        },
        _template: function (data) {
            var files = [];
            for (var i = 0; i < data.length; i += 1) {
                var file = doc.createElement('div');
                this._templateDirFile(file, data[i]);
                files.push(file);
            }
            return files;
        },
        _templateDirFile: function (el, data) {
            el.id = data.id;
            if (data.type === 'folder') {
                el.className = 'hfiler-dir';
                if (data.empty) {
                    el.className += ' ' + 'hfiler-dir--empty';
                }
            } else {
                el.className = 'hfiler-file';
            }
        },
        configData : {
            setType : 'type/folder/file',
            setData : /^id\/^name\/^type\/^url\/^buttons\/^properties\//ig
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
        isJSON: function () {
            var arg = arguments[0],
                _isJSON;
            _isJSON = Object.prototype.toString.call(arg).toLowerCase() === '[object object]' || Object.prototype.toString.call(arg).toLowerCase() === '[object array]';
            return _isJSON;
        }
    };
    Hfiler.utils.extend(Hfiler.fn, methodsFiler);

    hfiler.prototype = Hfiler.fn;

    return Hfiler;
}));