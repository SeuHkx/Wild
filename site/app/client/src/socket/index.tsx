/**
 * Created by hkx on 2016/11/24.
 */
const socket = (io:any,url:string)=>{
	let sk = io(url);
	sk.emit('come in', 'user');
	sk.on('come in',function (data:any) {
		console.log(data);
	})
};
export default socket;
