/**
 * Created by Hekx on 16/1/6.
 */
var mime = require('./mime');
var fs   = require('fs');

var router = {
    route: function (arg) {
        if(typeof arg.mapHandler[arg.path] === 'function'){
            arg.mapHandler[arg.path](arg.req,arg.res);
        }else{
            var ext   = arg.path.match(/(\.[^.]+|)$/)[0],
                check = /jpg|png|gif/gi;
            if(mime.lookupExtension(ext) !== 'text/plain'){
                if(check.test(ext)){
                    fs.readFile('.' + arg.path, 'binary', function(err, file){
                        if (err) throw err;
                        arg.res.writeHead(200, {'Content-Type': mime.lookupExtension(ext)});
                        arg.res.write(file, 'binary');
                        arg.res.end();
                    })
                }else{
                    fs.readFile('.' + arg.path,'utf-8',function(err,data){
                        if (err) throw err;
                        arg.res.writeHead(200, {'Content-Type': mime.lookupExtension(ext)});
                        arg.res.write(data);
                        arg.res.end();
                    });
                }
            }else{
                arg.res.writeHead(404, {'Content-Type': 'text/plain'});
                arg.res.write("404");
                arg.res.end();
            }
        }
    }
};
module.exports = router;