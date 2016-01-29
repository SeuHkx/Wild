window.onload = function () {
    var wrapper = document.getElementById('wrapper');

    var opts = {
        fileId: 'file',
        fileUploadUrl: '/upload',
        beforeUpload: function (fileInfo) {
            //todo
        },
        data: [{'Hkx': 'This is handsome', 'He': 'This is a boy'}, {'Dang': 'Test Dang'}],
        callback: function (data) {
            //todo
        },
        previewFile : function(progress,fileInfo,thumbnail){

            var div = document.createElement('div');
            var span= document.createElement('span');
            if(thumbnail !== false){
                var img = document.createElement('img');
                img.src = thumbnail;
                div.appendChild(img);
            }
            div.className = 'fileInfoBox';
            span.innerHTML= fileInfo.name;
            div.appendChild(span);
            div.appendChild(progress);
            wrapper.appendChild(div);
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
        previewFile : function(progress,fileInfo,thumbnail){

            var div = document.createElement('div');
            var span= document.createElement('span');
            if(thumbnail !== false){
                var img = document.createElement('img');
                img.src = thumbnail;
                div.appendChild(img);
            }
            div.className = 'fileInfoBox';
            span.innerHTML= fileInfo.name;
            div.appendChild(span);
            div.appendChild(progress);
            wrapper.appendChild(div);
        },
        beforeUpload: function (fileInfo) {
            //todo
        },
        callback: function (data) {
            //todo
        },
        multiple : true,
        control: false
    };
    var upLoadFile = hupload(configs);

};
