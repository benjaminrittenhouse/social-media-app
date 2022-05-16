import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Linking } from 'react-native'


// function, stateLESS
export default function Landing({ navigation }){
	return(
		<View style={styles.landingView}>

		<View style={styles.titleView}>
		<Text style={styles.title}>SM App</Text>
		</View>

		<View style={styles.buttons}>
			<TouchableOpacity 
				style={styles.landingButtons} 
				title="Register"
				onPress={() => navigation.navigate("Register")}
				>
				<Text style={styles.buttonText}>Register</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.landingButtons} 
				onPress={() => navigation.navigate("Login")}
			>
				<Text style={styles.buttonText}>Login</Text>
			</TouchableOpacity>
		</View>

		<View style={styles.gitView}>
		<Text style={styles.github} onPress={() => Linking.openURL('https://github.com/benjaminrittenhouse/outfit-otd')}>Github</Text>
		</View>
		</View>
	)
}


const styles = StyleSheet.create({
	titleView: {
		flex: 1/8,
    	alignItems: 'center',
	},
	title: {
		fontSize: 55,
		textAlign: 'center',
		flex: 1,
		fontWeight: 'bold'
	},
	landingButtons: {
		flex: 1,
		alignContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'center',
		color: 'black',
		fontFamily: 'Helvetica',
		borderRadius: 33,
		height: 10,
		width: 150,
		textAlign: 'center',
		margin: 10,
		backgroundColor: '#0c95f0'
	}, 
	buttonText: {
		fontSize: 20,
		fontFamily: 'Helvetica',
		fontWeight: 'bold',
	},
	landingView: {
		flex: 1,
		justifyContent: 'center',
	},
	buttons: {
		flex: 1/5,
    	alignItems: 'center',
	},
	github: {
		textAlign: 'center',
		textDecorationLine: 'underline', 
	},
	gitView: {
		flex: 1/5,
		justifyContent: 'flex-end',	
	}

})