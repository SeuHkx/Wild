/**
 * Created by hkx on 2016/11/17.
 */
import Server from './txh';
import Socket from './socket';
import * as chalk from 'chalk';

const port:number = 3333;
const app = Server.init().app;
const server = app.listen(port,()=>{
	console.log(chalk.white.bgMagenta.bold(`Listening on port ${port}`));
});
const socket = new Socket(server);


