import React, {useState} from 'react'

import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native'

import firebase from 'firebase/compat/app'

require('firebase/firestore')

export default function Search(props){
	const [users, setUsers] = useState([]);

	const fetchUsers = (search) => {
		firebase.firestore()
		.collection('users')
		.where('name', '>=', search)
		.get()
		.then((snapshot) => {
			let users = snapshot.docs.map(doc => {
					const data = doc.data();
					const id = doc.id;
					return {id, ...data};
				});

			setUsers(users);
		})
	}

	return(
		<View>
			<View style={styles.headerContainer}>
					<Text style={styles.headerText}>Search</Text>
			</View>
			<TextInput style = {styles.searchText} placeholder="Find someone..." onChangeText={(search) => fetchUsers(search)}/>
			<FlatList 
				numColumn={1}
				horizontal={false}
				data={users}
				style={styles.flatlist}
				renderItem={({item}) => (
					<TouchableOpacity onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
						<Text style={styles.usernames}>{item.name}</Text>
					</TouchableOpacity>
				)}
			/>
		</View>
	)
}

var styles = StyleSheet.create({
	headerText: {
		fontSize: 35,
		margin: 5,
		fontWeight: 'bold',
		fontStyle: 'italics',
	},
	headerContainer: {
		backgroundColor: '#0c95f0',
	},
	searchText: {
		placeholderTextColor: 'gray',
		marginLeft: 10,
		marginTop: 10,
		fontSize: 20,
	},
	flatlist: {
		margin: 10,
	},
	usernames: {
		fontSize: 20,
		marginBottom: 5,
	},
	...Platform.select({
      ios: {
      	headerContainer: {
      		paddingTop: 40,
      		backgroundColor: '#0c95f0' 
      	}
      }
  }),
})