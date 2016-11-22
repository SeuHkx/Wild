/**
 * Created by hkx on 2016/11/17.
 */
import Server from './txh';
import * as chalk from 'chalk';

const port:number = 3000;
const app = Server.init().app;

app.listen(port,()=>{
	console.log(chalk.white.bgMagenta.bold(`Listening on port ${port}`));
});

