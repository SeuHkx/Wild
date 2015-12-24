/**
 * Created by Hekx on 15/12/14.
 */
window.onload = function () {
     hscroll.roll({
            wrapper: 'wrap',
            scroll: 'scroll',
            height: 300,
            slider: {
                width: 12,
                color: '#2196F3',
                classes : 'test-slider'
            },
            bar: {
                width: 12,
                classes : 'test-bar'
            }
        });
     hscroll.roll({
            wrapper: 'wrapper',
            scroll: 'scrollWrap',
            height: 300,
            slider: {
                width: 6,
                color: '#ab2bc1'
            },
            bar: {
                width: 6,
                color: '#ab2bc1'
            }
        });
     hscroll.roll({
            wrapper: 'wrapper_three',
            scroll: 'scroll_three',
            height: 300,
            slider: {
                width: 6,
                color: '#ab2bc1'
            },
            bar: {
                width: 6,
                color: '#ab2bc1'
            },
             emit : function (distance,bottom) {
                 var load = document.getElementById('lodeHTML');
                 if(distance === bottom){
                     //todo
                     load.innerHTML +=  '<p>还需要多久 多长 多伤</p>';
                 }
             }
        });
    var btnBlue = document.getElementById('btnBlue');
    var strBlue = document.getElementById('strBlue');
    var btnPos  = document.getElementById('btnPos');
    var strPos  = document.getElementById('strPos');
    btnBlue.onclick = function(){
        strBlue.innerHTML = '如果当时吻你 当时抱你</br>'
                          + '也许结局难讲</br>'
                          + '我那么多遗憾 那么多期盼</br>'
                          + ' 你知道吗</br>';
        hscroll.fresh('wrap');
    };
    btnPos.onclick = function(){
        strPos.innerHTML = '还需要多久 多长 多伤<br>'
                            + '坚强像谎言一样 不过是一种伪装 我只希望有个机会能被你爱上<br>'
                            + '我还是爱着你 每分每秒一样 就好像一个傻瓜<br>';
        hscroll.fresh('wrapper');
    };
};