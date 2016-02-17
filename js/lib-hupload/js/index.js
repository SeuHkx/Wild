window.onload = function () {
    var wrapper = document.getElementById('wrapper');

    var opts = {
        fileId: 'file',
        fileUploadUrl: '/upload',
        beforeUpload: function (fileInfo,setData) {
            //todo
            console.log(fileInfo);
        },
        data: [{'Hkx': 'This is handsome', 'He': 'This is a boy'}, {'Dang': 'Test Dang'}],
        previewFile : function(progress,fileInfo,thumbnail,setData){

            var div = document.createElement('div');
            var img = document.createElement('img');
            var span= document.createElement('span');
            if(thumbnail !== false){
                img.src = thumbnail;
            }else{
                img.src = 'images/file_extension_others.png';
            }
            div.id = 'file' + ('Hupload' + Math.random()).replace(/\D/g, "");
            div.className = 'fileInfoBox';
            span.innerHTML= fileInfo.name;
            div.appendChild(img);
            div.appendChild(span);
            div.appendChild(progress);
            wrapper.appendChild(div);
            setData.push({id:div.id});
        },
        callback: function (data) {
            //todo
            var currDiv = document.getElementById(data.id);
            if(data.isImg){
                var img = currDiv.getElementsByTagName('img')[0];
                img.src = data.path;
                //
            }
        },
        control: true
    };
    var up = hupload(opts);

    var buttonUpload = document.getElementById('buttonUpload');
    buttonUpload.onclick = function () {
        up.upload();
    };
    var configs = {
        fileId: 'fileDemo',
        fileUploadUrl: '/upload',
        beforeUpload: function (fileInfo,setData) {
            //todo
            setData.push({'beforeId':'before' + ('file' +  Math.random()).replace(/\D/g, "")});
        },
        data : [{'Hkx' : 'This is handsome!'}],
        previewFile : function(progress,fileInfo,thumbnail,setData){

            var div = document.createElement('div');
            var img = document.createElement('img');
            var span= document.createElement('span');
            if(thumbnail !== false){
                img.src = thumbnail;
            }else{
                img.src = 'images/file_extension_others.png';
            }
            div.id = 'file' + ('Hupload' + Math.random()).replace(/\D/g, "");
            div.className = 'fileInfoBox';
            span.innerHTML= fileInfo.name;
            div.appendChild(img);
            div.appendChild(span);
            div.appendChild(progress);
            wrapper.appendChild(div);
            setData.push({id:div.id});
        },
        callback: function (data) {
            //todo
            var currDiv = document.getElementById(data.id);
            if(data.isImg){
                var img = currDiv.getElementsByTagName('img')[0];
                img.src = data.path;
            }
        },
        multiple : true,
        control: false
    };
    hupload(configs);
};
