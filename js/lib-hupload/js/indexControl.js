/**
 * Created by Hekx on 16/2/24.
 */
var buttonUpload = document.getElementById('buttonUpload');
var opts = {
    fileId: 'file',
    fileUploadUrl: '/upload',
    beforeUpload: function (fileInfo,setData) {
        //todo
        console.log(fileInfo,setData);
    },
    data: [{'Hkx': 'This is handsome', 'He': 'This is a boy'}, {'Dang': 'Test Dang'}],
    previewFile : function(progress,fileInfo,thumbnail,setData){
        //todo
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
buttonUpload.onclick = function () {
    up.upload();
};