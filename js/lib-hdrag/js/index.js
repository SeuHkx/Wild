/**
 * Created by Hekx on 16/3/17.
 */
window.onload = function(){
    var updateButton = document.getElementById('updateButton');
    var opts = {
        elements : 'wd-media',
        finish : function(){
            //console.log('finish');
        }
    };
    var drag = hdrag('wrapper',opts);

    var dragButton = hdrag('wrapper',{elements:'wd-button'});

    updateButton.onclick = function(){}
};