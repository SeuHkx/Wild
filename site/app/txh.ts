/**
 * Created by hkx on 2016/11/18.
 */
import * as Koa from 'koa';
import * as serve from 'koa-static';
import * as bodyParser from 'koa-bodyparser';
import router from './routes';



export default class Server{
	public app:Koa;
	public static init():Server{
		return new Server();
	}
	constructor(){
		this.app = new Koa();
		this.config();
		this.routes();
	}
	public config(){
		this.app.use(serve(__dirname + '/client/public'))
	}
	private routes(){
		this.app
			.use(bodyParser())
			.use(router.routes())
			.use(router.allowedMethods());
	}
}
