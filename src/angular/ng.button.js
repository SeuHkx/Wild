/**
 * Created by Hekx on 16/4/12.
 */
(function (ng) {
    var getTemplate = function (element,attrs) {
        var isUndefined = ng.isUndefined,
            buttonTemplate = '<button class="wd-button wd-button--default" ng-transclude></button>',
            anchorTemplate = '<a class="wd-button wd-button--default" ng-transclude></a>';
        return !isUndefined(attrs.href) ? anchorTemplate : buttonTemplate;
    };
    var postLink = function (scope,element,attrs) {
        if(!ng.isUndefined(attrs.styles))element.addClass(attrs.styles);
        element.on('click',function (event) {
            if(attrs.disabled === true){
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        })
    };
    var wdButtonDirective = function () {
        return {
            restrict : 'EA',
            replace  : true,
            transclude: true,
            scope    : true,
            template : getTemplate,
            link     : postLink
        }
    };
    ng.module('wd.button',[])
        .directive('wdButton',wdButtonDirective);
}(angular));
