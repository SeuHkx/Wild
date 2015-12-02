/**
 * Created by Hekx on 15/11/30.
 */
window.onload = function(){
    var buttons = document.getElementById('demo').getElementsByTagName('a');

    var i = 0;

    var iFrame = function(str){
        alert('我那么多遗憾那么多期盼,' +  str);
    };

    var buttonsEvent = function(el,index){
        el.onclick = function(){
            switch (index){
                case 0 :
                    hbox.open({
                        customClass : true,
                        title:'旅行的意义',
                        content:'你看过了许多美景</br>你看过了许多美女</br>你迷失在地图上每一道短暂的光阴',
                        button : ['信仰','关闭'],
                        callback : {
                            ok : function(){
                                //TODO
                                hbox.open({
                                    id : 'iframeID',
                                    title : '信仰',
                                    iframe : true,
                                    url : 'test/iframe.html',
                                    mask : false,
                                    button : ['忠于自己忠于爱情的信仰','关闭'],
                                    callback : {
                                        ok : function(){
                                            //open
                                            hbox.open({
                                                title : '你知道吗',
                                                content : '我爱你是多么清楚多么坚固的信仰</br>我爱你是多么温暖多么勇敢的力量</br>',
                                                button : ['你是否一样听见我的呼喊','爱是一种信仰'],
                                                callback : {
                                                    ok : function(){
                                                        alert('我那么多遗憾那么多期盼,你知道吗');
                                                        hbox.close();
                                                    },
                                                    alert : function(){
                                                        //open
                                                        hbox.open({
                                                            title : '信仰',
                                                            content : '我爱你是忠于自己忠于爱情的信仰</br>我爱你是来自灵魂来自生命的力量',
                                                            button : ['忠于自己忠于爱情的信仰'],
                                                            callback : {
                                                                ok : function(){
                                                                    //open
                                                                    hbox.open({
                                                                        id : 'iframeID2',
                                                                        iframe : true,
                                                                        url : 'test/iframe2.html'
                                                                    })
                                                                }
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                        },
                                        cancel : function(){
                                            hbox.close();
                                        }
                                    }
                                })
                            },
                            cancel : function(){
                                hbox.close();
                            }
                        },
                        repeat : false
                    });
                    hbox.register(iFrame);
                    break;
                case 1 :
                    hbox.open({
                        title:'相依为命',
                        width : 450,
                        height : 100,
                        content:'仍然自问幸福虽说有阵时为你生气</br>其实以前和你互相不懂得死心塌地</br>直到共你渡过多灾世纪',
                        button : ['相依为命'],
                        mask:false,
                        callback : {
                            ok : function(){
                                //TODO
                                hbox.close();

                            }
                        },
                        repeat : false
                    });
                    break;
                case 2 :
                    hbox.open({
                        title:'信仰',
                        width : 600,
                        content:'仍然自问幸福虽说有阵时为你生气</br>其实以前和你互相不懂得死心塌地</br>直到共你渡过多灾世纪',
                        button : ['信仰'],
                        mask:false,
                        callback : {
                            ok : function(){
                                //TODO
                                hbox.close();
                            }
                        },
                        repeat : false
                    });
                    break;
                case 3 :
                    hbox.open({
                        title:'你在南方的艳阳里大雪纷飞',
                        content:'如果天黑之前来得及</br>我要忘了你的眼睛</br>穷极一生做不完一场梦',
                        button : ['北秋悲'],
                        callback : {
                            ok : function(){
                                //TODO
                                hbox.close();
                            }
                        }
                    });
                    break;
            }
        }
    };
    for (;i < buttons.length; i += 1){
        buttonsEvent(buttons[i],i);
    }
};