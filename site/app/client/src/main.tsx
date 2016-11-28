/**
 * Created by hkx on 2016/11/23.
 */
declare const io:any;
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Loading from './loading';
import Footer  from './footer';
import socket from './socket';

const App:React.StatelessComponent<any> = ():any=>(
	<div>
		<Loading leftFlag="{" rightFlag="}" loadingText="正在开发中"/>
	</div>
);

ReactDOM.render(<App/>,document.getElementById('app'));
socket(io,'http://localhost:3333');













