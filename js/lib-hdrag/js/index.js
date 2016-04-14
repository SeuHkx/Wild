/**
 * Created by Hekx on 16/3/17.
 */
window.onload = function(){

    var opts = {
        elements : 'wd-media',
        finish : function(currIndex,crashIndex,direction){
            var wrapper1 = document.getElementById('wrapper1');
            var list1 = wrapper1.querySelectorAll('.wd-media');
            var element1 = list1[currIndex].cloneNode(true);
            if(direction === 'down'){
                wrapper1.removeChild(list1[currIndex]);
                element1.className += ' ' + 'magictime vanishIn';
                wrapper1.insertBefore(element1,list1[crashIndex].nextSibling);
            }else if(direction === 'up'){
                element1.className += ' ' + 'magictime vanishIn';
                wrapper1.removeChild(list1[currIndex]);
                wrapper1.insertBefore(element1,list1[crashIndex]);
            }
        }
    };
    var drag = hdrag('wrapper',opts);

    var drag1 = hdrag('wrapper1',{elements:'wd-media'});

};