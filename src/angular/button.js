/**
 * Created by Hekx on 16/4/12.
 */
angular.module('wd.button',[])
    .directive('wdButton',function () {
        return {
            restrict : 'EA',
            replace: true,
            transclude : true,
            scope : {
                type : '@'
            },
            template : '<a class="wd-button wd-button--default" ng-transclude></a>',
            link : function (scope,element,attrs) {
                if(attrs.styles)element.addClass(attrs.styles);
            }
        }
    });