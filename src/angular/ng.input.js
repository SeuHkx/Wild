/**
 * Created by Hekx on 16/4/14.
 */
(function (ng) {
    'use strict';
        var wdInputDirective = function (inputType) {
            return function ($timeout) {
                var getTemplate = function () {
                    var template;
                    switch (inputType){
                        case 'input' :
                            template = '<input placeholder="{{placeholder}}" name="{{name}}"/>';
                            break;
                        case 'textarea':
                            template = '<textarea placeholder="{{placeholder}}" name="{{name}}"></textarea>';
                            break;
                    }
                    return template;
                };
                var link = function (scope,element,attrs) {
                    var isUndefined = angular.isUndefined,
                        input = element[0];
                    if(!isUndefined(attrs.styles))element.addClass(attrs.styles);
                    if(!isUndefined(attrs.focus))input.focus();
                    if(!isUndefined(attrs.select)){
                        $timeout(function () {
                            input.select();
                        })
                    }
                };
                return {
                    restrict : 'EA',
                    replace  : true,
                    transclude:true,
                    scope    : {
                        placeholder : '@',
                        name : '@'
                    },
                    template :  getTemplate,
                    link     : link
                }
            }
        };
    ng.module('wd.input',[])
        .directive('wdInput',wdInputDirective('input'))
        .directive('wdTextarea',wdInputDirective('textarea'));
    wdInputDirective().$inject = ['$timeout'];
}(angular));
