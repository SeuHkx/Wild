/**
 * Created by hkx on 2016/11/23.
 */
import * as socketIO from 'socket.io';

export default class Socket{
	public io:any;
	public count = 0;
	constructor(server:any){
		this.io = socketIO.listen(server);
		this.connection();
	};
	private connection(){
		this.io.on('connection',(socket:any)=>{
			this.count++;
			socket.on('come in',(data:any)=>{
				this.io.emit('come in',{
					sequence:this.count
				});
			});
			socket.on('disconnect',()=>{
				console.log('user disconnected');
			});
			console.log(`welcome user:${this.count}`);
		})
	}
}