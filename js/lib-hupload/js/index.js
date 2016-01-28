window.onload = function () {
    var wrapper = document.getElementById('wrapper');

    var opts = {
        fileId: 'file',
        fileUploadUrl: '/upload',
        beforeUpload: function (fileInfo) {
            var elements = templateFileBox(fileInfo);
            wrapper.appendChild(elements.div);
        },
        data: [{'Hkx': 'This is handsome', 'He': 'This is a boy'}, {'Dang': 'Test Dang'}],
        progress: function (complete,index) {
            //todo
            var fileBox = document.querySelectorAll('.fileInfoBox');
            var progress= document.createElement('div');
            var progressInside = document.createElement('div');
            progress.className = 'progress';
            progressInside.className = 'progress-inside';
            progressInside.style.width = complete + '%';
            progress.appendChild(progressInside);
            fileBox[index].appendChild(progress);
        },
        callback: function (data) {
            //todo
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
        beforeUpload: function (fileInfo) {
            var elements = templateFileBox(fileInfo);
            wrapper.appendChild(elements.div);
        },
        data: [{'Hkx': 'This is handsome', 'He': 'This is a boy'}, {'Dang': 'Test Dang'}],
        progress: function (complete,index) {
            var fileBox = document.querySelectorAll('.fileInfoBox');
            var progress= document.createElement('div');
            var progressInside = document.createElement('div');
            progress.className = 'progress';
            progressInside.className = 'progress-inside';
            progressInside.style.width = complete + '%';
            progress.appendChild(progressInside);
            fileBox[index].appendChild(progress);
            console.log('progress:' + index);
        },
        callback: function (data,index) {
            //todo
        },
        multiple : true,
        control: false
    };
    var upLoadFile = hupload(configs);



    var templateFileBox = function(fileInfo){
        var div = document.createElement('div');
        var span= document.createElement('span');
        if(typeof fileInfo.index !== 'undefined'){
            if(typeof fileInfo[fileInfo.index].img !== 'undefined'){
                var img = document.createElement('img');
                img.src = fileInfo[fileInfo.index].img;
                div.appendChild(img);
            }
            span.innerHTML = fileInfo[fileInfo.index].name;
        }
        div.className = 'fileInfoBox';
        div.appendChild(span);
        return{
            div : div
        }
    }
};
