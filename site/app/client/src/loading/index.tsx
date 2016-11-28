import * as React from 'react';

interface LoadingProps{
	leftFlag?:string;
	rightFlag?:string;
	loadingText?:string;
}
const Loading:React.StatelessComponent<LoadingProps>=(props:LoadingProps):any=>(
	<div className="loader">
		<div className="loader-wrap">
			<span className="loader-span">{props.leftFlag}</span>
			<span className="loader-text">{props.loadingText}</span>
			<span className="loader-span loader-last">{props.rightFlag}</span>
		</div>
	</div>
);
export default Loading;