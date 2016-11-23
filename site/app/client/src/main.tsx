/**
 * Created by hkx on 2016/11/23.
 */
import * as React from 'react';

export interface HelloProps { compiler: string; framework: string; }

export class Hello extends React.Component<HelloProps, {}> {
	render() {
		return <h1>Hello Kitty</h1>;
	}
}