/**
 * Created by Hekx on 16/2/1.
 */


window.onload = function(){
    tabSwitch();
    var createButton = document.getElementById('createButton');
    var loading = document.getElementById('loading');
    var configs = {
        wrap : 'hfiles',
        init : function(){},
        classes : 'wd-utils-left animated flipInY',
        events: {
            Edit : function(filerNode,filer){
                alert('编辑');
                console.log(filerNode,filer);
            },
            Del : function(filerNode,filer){
                alert('删除');
                document.getElementById('hfiles').removeChild(filerNode);
                console.log(filerNode,filer);
            },
            Create: function(filerNode){
                alert('创建');
                console.log(filerNode);
            },
            Cancel: function(filerNode){
                document.getElementById('hfiles').removeChild(filerNode);
            }
        }
    };
    var filer = hfiler(configs);
    setTimeout(function(){
        filer.init(jsonData);
        document.getElementById('hfiles').removeChild(loading);
    },4000);
    createButton.onclick = function(){
        filer.build();
    };
    filer.add();
    //filer.update(id,{});

};

