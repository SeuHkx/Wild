/**
 * Created by Hekx on 16/3/11.
 */
window.onload = function(){

    var config = {
        height : 333
    };
    var opts   = {
        height : 333
    };
    var setting= {
        height : 333
    };
    var change = {
        height : '100%'

    };
    var scroll   = hscroll('wrap',opts);
    var myScroll = hscroll('wrapper',config);
    var srcollT  = hscroll('wrapper_three',setting);
    var srcollF  = hscroll('scrollChange',change);

    var btnBlue = document.getElementById('btnBlue');
    var strBlue = document.getElementById('strBlue');
    var btnPos  = document.getElementById('btnPos');
    var strPos  = document.getElementById('strPos');

    var testButton = document.getElementById('testButton');
    testButton.onclick = function(){
        strPos.innerHTML += '1</br>';
        myScroll.refresh();
    };
    btnBlue.onclick = function(){
        strBlue.innerHTML = '如果当时吻你 当时抱你</br>'
            + '也许结局难讲</br>'
            + '我那么多遗憾 那么多期盼</br>'
            + ' 你知道吗</br>';
        scroll.refresh();
    };
    btnPos.onclick = function(){
        strPos.innerHTML += '还需要多久 多长 多伤<br>'
            + '坚强像谎言一样 不过是一种伪装 我只希望有个机会能被你爱上<br>'
            + '我还是爱着你 每分每秒一样 就好像一个傻瓜<br>';
        myScroll.refresh();
    };

};



