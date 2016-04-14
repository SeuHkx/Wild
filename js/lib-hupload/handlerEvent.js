/**
 * Created by Hekx on 16/1/6.
 */
var fs   = require('fs');
var url  = require('url');
var util = require('util');
var querystring = require('querystring');
var formidable  = require('formidable');

var handlerEvent = {
    mapHandler : {},
    main  : function(req,res){
        fs.readFile('./index.html','utf-8',function(err,data){
            if (err) throw err;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    },
    upload : function(req,res){
        if(req.method.toLowerCase() === 'post'){
            var form = new formidable.IncomingForm();
            form.encoding  = 'utf-8';
            form.uploadDir = 'file/';
            form.keepExtensions = true;
            form.parse(req,function(err,fields,files){

                var data = {
                    type: 'file',
                    id   : fields.id,
                    name : files.upload.name,
                    icon  : 'file/' + files.upload.name,
                    isImg: false,
                    buttons : [{name:"编辑",func : 'Edit'},{name:"移动",func : 'Move'},{name:"删除",func:'Del'},{name:'下载',href:'www.baidu.com'}],
                    url : 'file/' + files.upload.name,
                    properties: [
                        {name:"创建人:",value:"张三"},
                        {name:"创建日期:",value:"2015-01-01"},
                        {name:"分类:",value:"艺术创作/音乐"},
                        {name:"原文件名:",value:"活着.mp4"},
                        {name:"认证时间:",value:"2015-01-01 22:12"}
                    ]
                };

                if(err){
                    data.success = false;
                }else{
                    var ext   = files.upload.name.match(/(\.[^.]+|)$/)[0].replace('.',''),
                        docx  = /docx/,
                        mp3   = /(mp3|audio)/,
                        zip   = /zip/,
                        images = /(jpg|png|gif)/;
                    if(images.test(ext)){
                        data.isImg = true;
                    }
                    if(mp3.test(ext)){
                        data.icon = 'images/file_extension_mp3.png';
                    }
                    if(zip.test(ext)){
                        data.icon = 'images/file_extension_zip.png'
                    }
                    if(docx.test(ext)){
                        data.icon = 'images/file_extension_docx.png';
                    }
                    if(!images.test(ext)&&!mp3.test(ext)&&!zip.test(ext)&&!docx.test(ext)){
                        data.icon = 'images/file_extension_others.png';
                    }
                    data.success = true;
                }
                fs.renameSync(files.upload.path, './file/'+ files.upload.name);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(JSON.stringify(data));
                res.end();
                console.log("*---^上传成功^---* :  " + files.upload.name);
                console.log(util.inspect({fields: fields, files: files}))
            })
        }else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('This is upload');
            res.end();
        }
    }
};
handlerEvent.mapHandler['/'] = handlerEvent.main;
handlerEvent.mapHandler['/upload'] = handlerEvent.upload;
module.exports = handlerEvent;