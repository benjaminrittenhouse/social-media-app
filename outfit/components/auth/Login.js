import React, {Component} from 'React'
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

		this.onSignUp = this.onSignUp.bind(this);
	}

	onLogin(){
		const { email, password, name } = this.state;
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
				/>

				<TextInput 
					placeholder="password"
					secureTextEntry={true}
					onChangeText={(password) => this.setState({ password })}
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