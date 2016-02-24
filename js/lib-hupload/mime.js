/**
 * Created by Hekx on 16/1/7.
 */

var mime = {
    lookupExtension : function(ext){
        return this.TYPE[ext.toLowerCase()] || 'text/plain';
    },
    TYPE : {
        '.css' : 'text/css',
        '.js'  : 'application/javascript;charset=utf-8',
        '.png' : 'image/png',
        '.jpg' : 'image/jpeg',
        '.gif' : 'image/gif'
    }
};

module.exports = mime;