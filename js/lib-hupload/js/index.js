window.onload = function () {
    var wrapper = document.getElementById('wrapper');
    var loading = document.getElementById('loading');
    var createFile = document.getElementById('createFile');
    var opts  = {
        wrap : 'wrapper',

        classes : 'wd-utils-left animated flipInY custom',
        events: {
            Edit : function(filerNode,filer){
                alert('编辑');
                console.log(filerNode,filer);
            },
            Del : function(filerNode,filer){
                hbox.open({
                    cssAnimation  : ['magictime spaceInUp','magictime spaceOutUp'],
                    mask : false,
                    title:'提示消息',
                    content:'注意：文件夹和里面的文件将一同被删除，且不可恢复。请谨慎操作！',
                    button : ['确定','取消'],
                    buttonClass : ['red','blue'],
                    callback : {
                        ok : function(){
                            //TODO
                            document.getElementById('wrapper').removeChild(filerNode);
                            hbox.close();
                        },
                        cancel : function(){
                            hbox.close();
                        }
                    },
                    drag : true
                });
                console.log(filerNode,filer);
            }
        }
    };
    var filer  = hfiler(opts);
    setTimeout(function(){
        filer.init(jsonData);
        document.getElementById('wrapper').removeChild(loading);
    },800);
    var configs = {
        fileId: 'fileDemo',
        fileUploadUrl: '/upload',
        maxFileSize : '100KB',
        maxFileSizeFn : function(name){
            hbox.open({
                cssAnimation  : ['magictime foolishIn','magictime foolishOut'],
                mask : false,
                title:'提示消息',
                content:'选择的文件:'+'<span style="color: red;">'+ name +'</span>'+' 超出上传文件大小的范围,请重新选择!',
                button : ['确定'],
                buttonClass : ['red'],
                callback : {
                    ok : function(){
                        hbox.close();
                    }
                }
            });
        },
        beforeUpload: function (fileInfo,setData) {
            //todo
            setData.push({'beforeId':'before' + ('file' +  Math.random()).replace(/\D/g, "")});
        },
        data : [{'Hkx' : 'This is handsome!'}],
        previewFile : function(progress,fileInfo,thumbnail,setData){
            var dataInit = {
                name : fileInfo.name,
                size : fileInfo.size
            };
            if(thumbnail !== false){
                dataInit.url = thumbnail;
            }else{
                dataInit.url = 'images/file_extension_others.png';
            }
            var node = filer.buildUploadFile(dataInit);
            node.file.appendChild(progress);
            if(wrapper.children.length === 0){
                wrapper.insertBefore(node,null);
            }
            wrapper.insertBefore(node.file,wrapper.children[0]);
            setData.push({id:node.fileID});
        },
        callback: function (data) {
            //todo
            var currDiv = document.getElementById(data.id);
            var imgIcon = currDiv.getElementsByTagName('img')[0];
            var progress= currDiv.children[1];
            progress.className += ' ' + 'animated hinge';
            setTimeout(function(){
                imgIcon.className += ' ' + 'magictime foolishOut';
                currDiv.removeChild(progress);
                setTimeout(function(){
                    var node = filer.updateFile(data,data.id);
                    var img  = node.getElementsByTagName('img')[0];
                    img.className = 'magictime foolishIn';
                },1400);
            },3000);
        },
        error : function(){

        },
        multiple : true,
        control: false
    };
    hupload(configs);
    createFile.onclick = function(){
        var setting = {
            buttons : ['确定','取消'],
            events  : {
                creates : function(filerNode,id,name){
                    var dataInit = {
                        id : id,
                        name : name ,
                        type: "folder",
                        url:"/originalService/app/group/documentList/78b58204-e704-11e4-8c63-c81f66f585f9",
                        buttons : [{name:"编辑",func : 'Edit'},{name:"移动",func : 'Move'},{name:"删除",func:'Del'}],
                        empty : true
                    };
                    alert(name);
                    filer.updateFolder(dataInit,id);
                },
                cancel  : function(filerNode){
                    //todo
                    document.getElementById('wrapper').removeChild(filerNode);
                }
            }
        };
        filer.build(setting);
    }
};
