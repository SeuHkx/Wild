/**
 * Created by Hekx on 16/1/5.
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
        window.hupload = factory.call(window);
    }
}(typeof global === 'object' ? global : window, function () {
    'use strict';

    var checkFile = (function () {
        var file = typeof File !== 'undefined' ? true : false,
            form = typeof window.FormData !== 'undefined' ? true : false,
            fileReader = typeof FileReader !== 'undefined' ? true : false;
        return {
            file: file,
            form: form,
            fileReader: fileReader
        }
    }());
    var Hupload = function (opts) {
        return new Hupload.fn.init(opts);
    };
    Hupload.fn = Hupload.prototype;

    var init = Hupload.fn.init = function (opts) {
            var config = {
                fileId: '',
                fileUploadUrl: '',
                beforeUpload: '',
                maxFileSize: '',
                allowFileType: '',
                data: null,
                callback: null,
                control: false
            };
            this.opts = Hupload.utilKit.extend({}, config);
            for (var attr in opts) {
                if (this.opts.hasOwnProperty(attr)) {
                    this.opts[attr] = opts[attr];
                }
            }
            this.fileInput = Hupload.utilKit.$node(this.opts.fileId);
            //ie
            if (!checkFile.file && !checkFile.form && !checkFile.fileReader) {
                // todo ie
                this._IE = {
                    wrapper: document.createElement('div'),
                    target: Hupload.utilKit.expando('iframe'),
                    timer: null
                };
                console.log('IE!')
            }
            this._IE = {
                wrapper: document.createElement('div'),
                target: Hupload.utilKit.expando('iframe'),
                timer: null
            };
            !this.opts.control && this._init();
        },
        methodsUploadFile;
    init.prototype = Hupload.fn;
    methodsUploadFile = {
        upload: function () {
            var self = this;
            if (this.opts.control === true && !checkFile.file && !checkFile.form && !checkFile.fileReader && self.fileInput.value !== '') {
                self._onChangeUpload();
            }
        },
        _init: function () {
            if (checkFile.file && checkFile.form && checkFile.fileReader) {
                //todo ajax
                this._onIEChange();
            } else {
                //todo ie
                this._onIEChange();
            }
        },
        _template: function () {
            var inputHidden = '',
                iFrame,
                form;
            if (this.opts.data !== null) {
                var l = this.opts.data.length;
                for (var i = 0; i < l; i += 1) {
                    for (var attr in this.opts.data[i]) {
                        inputHidden += '<input type="hidden" value="' + this.opts.data[i][attr] + '" name="' + attr + '"/>'
                    }
                }
            }
            iFrame = '<iframe name="' + this._IE.target + '" id="' + Hupload.utilKit.expando("iframeId") + '" style="display: none;"></iframe>';
            form = '<form target="' + this._IE.target + '" action="' + this.opts.fileUploadUrl + '" method="post" enctype="multipart/form-data">' + inputHidden + '</form>';
            this._IE.wrapper.setAttribute('id', this._IE.target);
            this._IE.wrapper.style.display = 'none';
            this._IE.wrapper.innerHTML = iFrame + form;
            document.body.appendChild(this._IE.wrapper);
        },
        _onIEChange: function () {
            var self = this;
            var __onChangeUpload = Hupload.utilKit.bind(self, self._onChangeUpload);
            Hupload.utilKit.addEvent(self.fileInput, 'change', __onChangeUpload);
        },
        _onChangeUpload: function () {
            //IE
            this._template();
            this._onLoadFrame();
            var _fileInput = this.fileInput.cloneNode(true),
                _form = Hupload.utilKit.$node(this._IE.target, 'form'),
                self = this;
            this.fileInput.parentNode.appendChild(_fileInput);
            _form.appendChild(this.fileInput);
            _form.submit();
            this._removeFrame(_fileInput, self);
        },
        _removeFrame: function (_file, self) {
            this._IE.timer = setTimeout(function () {
                console.log('remove');
                _file.parentNode.appendChild(self.fileInput);
                _file.parentNode.removeChild(_file);
                document.body.removeChild(self._IE.wrapper);
                clearTimeout(self._IE.timer);
            }, 80);
        },
        _onLoadFrame: function () {
            var _frame = Hupload.utilKit.$node(this._IE.target, 'iframe');
            var self = this;
            var __onLoadFrameFn = Hupload.utilKit.bind(self, self._onLoadFrameFn);
            Hupload.utilKit.addEvent(_frame, 'load', __onLoadFrameFn);
        },
        _onLoadFrameFn: function () {
            var _frame = Hupload.utilKit.$node(this._IE.target, 'iframe');
            if (this.opts.callback !== null && typeof this.opts.callback === 'function') {
                var data = JSON.parse(_frame.contentWindow.document.body.innerHTML);
                this.opts.callback(data);
            }
        }
    };
    Hupload.utilKit = {
        $node: function () {
            var arg = [].slice.call(arguments);
            if (typeof arg[0] === 'string' && arg.length === 1) {
                return document.getElementById(arg[0]);
            } else if (typeof arg[1] === 'string') {
                var parent = document.getElementById(arg[0]),
                    child = parent.getElementsByTagName(arg[1]);
                return child[0];
            }
        },
        addEvent: function (el, type, fn, bubble) {
            if (el.addEventListener) {
                el.addEventListener(type, fn, !!bubble);
            } else if (el.attachEvent) {
                el.attachEvent('on' + type, fn);
            }
        },
        extend: function () {
            var arg = [].slice.call(arguments);

            if (typeof arg[0] !== 'object') {
                return arg[0];
            }
            if (this.isEmpty(arg[0])) {
                for (var attr in arg[1]) {
                    arg[0][attr] = this.extend(arg[1][attr]);
                }
                return arg[0];
            } else {
                for (var name in arg[1]) {
                    arg[0][name] = this.extend(arg[1][name]);
                }
            }
        },
        isEmpty: function (o) {
            for (var name in o) {
                return false
            }
            return true;
        },
        bind: function (self, fn) {
            return function () {
                fn.apply(self, arguments);
            }
        },
        expando: function (str) {
            return str + ('Hupload' + Math.random()).replace(/\D/g, "");
        }
    };
    Hupload.utilKit.extend(init.prototype, methodsUploadFile);

    return Hupload;
}));