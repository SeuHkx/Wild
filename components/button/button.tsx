import React,{Component} from 'react';
import classname from 'classnames';

export type ButtonType = 'primary' | 'ghost' | 'dashed'
export type ButtonShape = 'circle' | 'circle-outline'
export type ButtonSize = 'small' | 'large'

export interface ButtonProps {
	type?: ButtonType;
	htmlType?: string;
	icon?: string;
	shape?: ButtonShape;
	size?: ButtonSize;
	onClick?: React.FormEventHandler<any>;
	onMouseUp?: React.FormEventHandler<any>;
	loading?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	prefixCls?: string;
	className?: string;
}

export default class Button extends Component<ButtonProps, any>{
	render(){
		return (
			<button>
				test
			</button>
		);
	}
}


