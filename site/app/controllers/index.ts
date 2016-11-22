/**
 * Created by hkx on 2016/11/22.
 */
import * as Koa from 'koa';
import render from '../render';

const controllers = {
	index : async(ctx:Koa.Context):Promise<void>=>{
		ctx.body = await render('index.pug');
	}
};
export default controllers;