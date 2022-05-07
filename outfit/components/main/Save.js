import React, {useState} from 'react'
import { View, TextInput, Image, Button } from 'react-native'

import  firebase from 'firebase/compat/app';
import { serverTimeStamp } from 'firebase/firestore';
import 'firebase/auth';
import {getStorage, ref, uploadBytes } from 'firebase/storage'; // require?


export default function Save(props, {navigation}){
	console.log(props.route.params.image);
	const [caption, setCaption] = useState("");

	const uploadImage = async () => {
		const uri = props.route.params.image;

		const response = await fetch(uri);

		const blob = await response.blob();

		const storage = getStorage();

		const storageRef = ref(storage, `/posts/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`);
		
		console.log("Ref:" + storageRef);

		// 'file' comes from the Blob or File API
		uploadBytes(storageRef, blob).then((snapshot) => {
  			console.log('Uploaded a blob!');
  			console.log("snapshot:");
  			console.dir(snapshot);
  			savePostData(snapshot);
		});

	}

	//console.log("field value: " + firebase.firestore.FieldValue.serverTimeStamp());

	//let collectionRef = firebase.firestore().collection('posts').doc(firebase.auth().currentUser.uid);

	const savePostData = (downloadURL) => {
		firebase.firestore()
			.collection('posts')
			.doc(firebase.auth().currentUser.uid)
			.collection('userPosts')
			.add({
				url: downloadURL.metadata.fullPath,
				caption,
				creation: downloadURL.metadata.timeCreated,
			})/*.then((function () {
				navigation.popToTop();
			}))*/
	}

	return(
		<View style={{flex: 1}}>
			<Image source={{ur: props.route.params.image}}/>
			<TextInput 
				placeholder="Write a caption."
				onChangeText={(caption) => setCaption(caption)}
			/>

			<Button title="Save" onPress={() => uploadImage()}/>
		</View>
	)
}