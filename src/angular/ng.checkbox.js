/**
 * Created by Hekx on 16/4/21.
 */
(function (ng) {
    ng.module('wd.checkbox',[])
        .directive('wdCheckbox')
        .directive('wdRadio');
    // var checkBoxDirective = function (isType) {
    //     return ['$timeout', function ($timeout) {
    //         var getTemplate = function () {
    //                 var template;
    //                 isType ? template = '<div class="wd-checkbox" ng-transclude></div>' : '<div class="wd-radio" ng-transclude></div>';
    //                 return template;
    //             },
    //             checkboxController = function ($scope,$element,$attrs) {
    //                 var isUndefined = angular.isUndefined;
    //                 if(!isUndefined($attrs.styles))$element.addClass($attrs.styles);
    //                 this.setLabel = function () {
    //                     return $scope.label;
    //                 };
    //             };
    //         return{
    //             restrict : 'EA',
    //             replace  : true,
    //             transclude: true,
    //             controller : checkboxController,
    //             scope : {
    //                 label : '@'
    //             },
    //             template : getTemplate
    //         }
    //     }]
    // },
    //     checkBoxLabel = function () {
    //         var postLink = function (scope,element,attrs,ctrl) {
    //             var $scope  = ctrl.setLabel(),
    //                 isUndefined = angular.isUndefined;
    //             scope.label = $scope;
    //             if(isUndefined(scope.id))scope.id = element.parent().find('input').attr('id');
    //         };
    //         return{
    //             restrict : 'EA',
    //             require  : '^wdCheckbox',
    //             scope    : {
    //                 label : '@',
    //                 id  : '@?'
    //             },
    //             replace  : true,
    //             transclude: true,
    //             template : '<label for="{{id}}" ng-transclude>{{label}}</label>',
    //             link : postLink
    //         }
    //     };
    // ng.module('wd.checkbox',[])
    //     .directive('wdCheckbox',checkBoxDirective(true))
    //     .directive('wdRadio',checkBoxDirective(false))
    //     .directive('wdCheckboxLabel',checkBoxLabel);

}(angular));