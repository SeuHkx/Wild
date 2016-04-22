/**
 * Created by Hekx on 16/4/21.
 */
(function (ng) {
    var checkboxDirective = function () {
        var getTemplate = function () {
                
            },
            postLink = function () {
                
            };
        return{
            restrict : 'EA',
            replace  : true,
            transclude: true,
            scope : {},
            template : getTemplate,
            link : postLink
        }
    };
    ng.module('wd.checkbox',[])
        .directive('wdCheckbox',checkboxDirective);
}(angular));