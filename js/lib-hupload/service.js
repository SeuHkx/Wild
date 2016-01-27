/**
 * Created by Hekx on 16/1/5.
 */

var http = require('http');
var url  = require('url');

var server = {
    start : function(route,mapHandler){
        var request = function(request, response){
            var arg = {
                path : url.parse(request.url).pathname,
                mapHandler : mapHandler,
                req : request,
                res : response
            };
            route(arg);
        };
        http.createServer(request).listen(9999);
    }
};
module.exports = server;


