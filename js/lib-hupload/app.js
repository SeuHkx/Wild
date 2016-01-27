/**
 * Created by Hekx on 16/1/6.
 */
var server = require('./service');
var router = require('./router');
var handler= require('./handlerEvent');


server.start(router.route,handler.mapHandler);