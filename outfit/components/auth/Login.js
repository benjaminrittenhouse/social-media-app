import React, {Component} from 'react'
import {View, Button, TextInput} from 'react-native'

import firebase from 'firebase/compat/app' 

//stateFULL
export class Login extends Component {
	constructor(props){
		super(props);

		this.state = {
			email: '',
			password: ''
		}

		this.onLogin = this.onLogin.bind(this);
	}

	onLogin(){
		const { email, password } = this.state;
		firebase.auth().signInWithEmailAndPassword(email, password)
		.then((result) => {
			console.log(result);
		})
		.catch((error) => {
			console.log("Error in onLogin(): " + error);
		})
	}

	render() {
		return(
			<View>
				<TextInput 
					placeholder="email"
					onChangeText={(email) => this.setState({ email })}
					style={{backgroundColor: 'blue'}}
				/>

				<TextInput 
					placeholder="password"
					secureTextEntry={true}
					onChangeText={(password) => this.setState({ password })}
					style={{backgroundColor: 'blue'}}
				/>

				<Button 
					onPress= {()=> this.onLogin()}
					title="Login"
				/>
				
			</View>
		)
	}
}

export default Login