import React, {Component} from 'react'
import {View, Button, TextInput, StyleSheet, TouchableOpacity, Text} from 'react-native'

import firebase from 'firebase/compat/app' 

//stateFULL
export class Register extends Component {
	constructor(props){
		super(props);

		this.state = {
			email: '',
			password: '',
			name: ''
		}

		this.onSignUp = this.onSignUp.bind(this);
	}

	onSignUp(){
		const { email, password, name } = this.state;
		firebase.auth().createUserWithEmailAndPassword(email, password)
		.then((result) => {
			firebase.firestore().collection("users")
			.doc(firebase.auth().currentUser.uid)
			.set({
				name,
				email
			})
			console.log(result);
		})
		.catch((error) => {
			console.log("Error in onSignUp(): " + error);
		})
	}

	render() {
		return(
			<View style={styles.view}>

				<View style={styles.inputs}>
				<TextInput 
					placeholder="email"
					onChangeText={(email) => this.setState({ email })}
					style={styles.input}
				/>

				<TextInput 
					placeholder="username"
					onChangeText={(name) => this.setState({ name })}
					style={styles.input}
				/>

				<TextInput 
					placeholder="password"
					secureTextEntry={true}
					onChangeText={(password) => this.setState({ password })}
					style={styles.input}
				/>
				</View>

				<View style={styles.buttonView}>
				<TouchableOpacity 
					onPress= {()=> this.onSignUp()}
					style={styles.button}
				>
					<Text style={styles.buttonText}>Register</Text>
				</TouchableOpacity>
				</View>
				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	view: {
		flex: 1,
		justifyContent: 'center',
	},
	inputs: {
		flex: 1/3,
		justifyContent: 'center',
	},
	input: {
		fontSize: 25,
		textAlign: 'center',
		margin: 10,
		height: 25,
		backgroundColor: '#0c95f0',
		borderRadius: 33,
		color: 'black',
		placeholderTextColor: 'black',
	},
	buttonView: {
		flex: 1/3,
		justifyContent: 'center',
	},
	button: {
		backgroundColor: '#0c95f0',
		textAlign: 'center',
		borderRadius: 33,
		flex: 1/5,
		justifyContent: 'center',
	},
	buttonText: {
		color: 'white',
		fontSize: 40,
		fontWeight: 'bold',
	}

})

export default Register