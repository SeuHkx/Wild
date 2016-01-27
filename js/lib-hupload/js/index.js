window.onload = function(){
    var opts = {
        fileId : 'file',
        fileUploadUrl: '/upload',
        beforeUpload: function (file) {
            //todo
            alert('上传之前调用');
            console.log(file);
        },
        data: [{'Hkx': 'This is handsome', 'He': 'This is a boy'},{'Dang' : 'Test Dang'}],
        callback : function (data) {
            var infoText= document.getElementById('infoText');
            infoText.innerHTML = data.fileName;
            console.log(data);
        },
        preview : function(data){
            var img = document.createElement('img');
            img.src = data;
            document.body.appendChild(img);
        },
        progress : function(complete){
              console.log(complete);
        },
        control : false
    };
    var up = hupload(opts);

    var buttonUpload = document.getElementById('buttonUpload');

    buttonUpload.onclick = function(){
        up.upload();
    };
};


























//window.onload = function(){
//
//    var button = document.getElementById('buttonUpload');
//
//    button.addEventListener('click',function(){
//        $.ajax({
//            url: '/upload',
//            type: 'POST',
//            cache: false,
//            data: new FormData($('#frmUploadFile')[0]),
//            processData: false,
//            contentType: false
//        }).done(function(res) {
//            console.log(res);
//        }).fail(function(res) {
//            console.log(res);
//        });
//    })
//};