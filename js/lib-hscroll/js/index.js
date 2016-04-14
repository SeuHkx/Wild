/**
 * Created by Hekx on 16/3/11.
 */
window.onload = function(){
    var flag   = false;
    var opts   = {
        height : '100%',
        emit   : function (self,distance,bottom) {
            if(distance === bottom && !flag){
                flag = true;
                setTimeout(function () {
                    flag = false;
                    strText.innerHTML += '还需要多久 多长 多伤<br>'
                        + '坚强像谎言一样 不过是一种伪装 我只希望有个机会能被你爱上<br>'
                        + '我还是爱着你 每分每秒一样 就好像一个傻瓜<br>';
                    scroll.refresh();
                },2000);
            }
        },
        transition : true
    };
    var config = {
        height : 333,
        slider :{
            color : 'rgba(0, 0, 0, 0.498039)'
        },
        show : false,
        transition : true
    };
    var scroll   = hscroll('wrap',opts);
    var myScroll = hscroll('wrapper',config);

    var strBlue = document.getElementById('strBlue');
    var btnPos  = document.getElementById('btnPos');
    var strPos  = document.getElementById('strPos');
    var rightBtn= document.getElementById('rightBtn');
    var rightAddBtn= document.getElementById('rightAddBtn');
    var strText = document.getElementById('strText');

    var testButton = document.getElementById('testButton');
    testButton.onclick = function(){
        strPos.innerHTML = '';
        myScroll.refresh();
    };
    btnPos.onclick = function(){
        strPos.innerHTML += '还需要多久 多长 多伤<br>'
            + '坚强像谎言一样 不过是一种伪装 我只希望有个机会能被你爱上<br>'
            + '我还是爱着你 每分每秒一样 就好像一个傻瓜<br>';
        myScroll.refresh();
    };
    rightBtn.onclick = function () {
        strText.innerHTML = '';
        scroll.refresh();
    };
    rightAddBtn.onclick = function () {
        strText.innerHTML += '还需要多久 多长 多伤<br>'
            + '坚强像谎言一样 不过是一种伪装 我只希望有个机会能被你爱上<br>'
            + '我还是爱着你 每分每秒一样 就好像一个傻瓜<br>';
        scroll.refresh();
    }
};



