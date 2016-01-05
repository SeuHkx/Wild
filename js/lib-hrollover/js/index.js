/**
 * Created by Hekx on 15/12/29.
 */
;(function(){

    var config = {
        element      : 'headerRoll',
        offset       : 300,
        type         : 'modern',
        cssAnimation : ['animated slideOutUp','animated slideInDown']
    };
    var opts  = {
        element      : 'top',
        offset       : 300,
        cssAnimation : ['animated slideInUp show','animated slideOutDown show']
    };
    hrollover.init(config);
    hrollover.init(opts);
}());