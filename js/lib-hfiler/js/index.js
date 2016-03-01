/**
 * Created by Hekx on 16/2/1.
 */


window.onload = function(){
    tabSwitch();
    var createButton = document.getElementById('createButton');
    var createFileButton = document.getElementById('createFileButton');
    var loading = document.getElementById('loading');
    var configs = {
        wrap : 'hfiles',
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
            }
        }
    };
    var filer = hfiler(configs);

    setTimeout(function(){
        document.getElementById('hfiles').removeChild(loading);
        filer.init(jsonData);
    },1200);
    createButton.onclick = function(){
        var setting = {
            buttons : ['创建','取消'],
            events  : {
                creates : function(filerNode,id,name){
                    var dataInit = {
                        project:true,
                        id : id,
                        name : name ,
                        type: "folder",
                        url:"/originalService/app/group/documentList/78b58204-e704-11e4-8c63-c81f66f585f9",
                        buttons : [{name:"编辑",func : 'Edit'},{name:"移动",func : 'Move'},{name:"删除",func:'Del'},{name:'下载'}],
                        empty : true
                    };
                    filer.updateFolder(dataInit,id);
                },
                cancel  : function(filerNode){
                    //todo
                    alert('取消');
                    document.getElementById('hfiles').removeChild(filerNode);
                }
            }
        };
        filer.build(setting);
    };
    createFileButton.onclick = function(){
        filer.add(addData);
    }
};

