import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';


var styles = StyleSheet.create({
	separator: {
		height: 1,
		marginTop: 1,
		backgroundColor: '#E6E6E6',
		flex: 1,
		marginLeft: 105,
	}
});

export default class Separator extends Component{
	render() {
		return (
			<View style = {[styles.separator,{marginLeft:this.props.marginLeft}]}/>
		)
	}
};