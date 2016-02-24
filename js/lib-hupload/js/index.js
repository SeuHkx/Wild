window.onload = function () {
    var wrapper = document.getElementById('wrapper');
    var loading = document.getElementById('loading');
    var opts  = {
        wrap : 'wrapper',

        classes : 'wd-utils-left animated flipInY custom',
        events: {
            Edit : function(filerNode,filer){
                alert('编辑');
                console.log(filerNode,filer);
            },
            Del : function(filerNode,filer){
                alert('删除');
                document.getElementById('wrapper').removeChild(filerNode);
                console.log(filerNode,filer);
            }
        }
    };
    var filer  = hfiler(opts);
    setTimeout(function(){
        filer.init(jsonData);
        document.getElementById('wrapper').removeChild(loading);
    },1000);
    var configs = {
        fileId: 'fileDemo',
        fileUploadUrl: '/upload',
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
        multiple : true,
        control: false
    };
    hupload(configs);
};
