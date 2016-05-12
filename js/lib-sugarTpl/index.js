/**
 * Created by Hekx on 16/3/2.
 */
window.onload = function () {
    var btn  = document.getElementById('button');
    var view = document.getElementById('view');
    var source = document.getElementById('tplDemo').innerHTML;
    var tpl  = sugarTpl(source);

    btn.onclick = function(){
        tpl.compile(json,function(tpl){
            view.innerHTML = tpl;
        });
    };
};