/**
 * Created by hkx on 2016/11/22.
 */
'use strict';
import * as Pug from 'pug';

const compile =(path?:string,options?:{}):string =>{
	let reallyPath = __dirname.replace('render','');
	let html = Pug.renderFile(reallyPath+'/views/'+path,options);
	return html;
};
export default compile;