import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Button, TextInput, StyleSheet, forceUpdate } from 'react-native'

import firebase from 'firebase/compat/app'
import 'firebase/firestore';

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchUsersData} from '../redux/actions/index'

function Comment(props) {

	const [comments, setComments] = useState([]);
	const [postId, setPostId] = useState("");
	const [text, setText] = useState("");

	useEffect(() => {

		function matchUserToComment(comments){
			for(let i = 0; i < comments.length; i++){

				if(comments[i].hasOwnProperty('user')){
					continue;
				}

				const user = props.users.find(x => x.uid === comments[i].creator)
				if(user == undefined){
					props.fetchUsersData(comments[i].creator, false);
				} else {
					comments[i].user = user;
				}
			}

			setComments(comments);
		}

		// run query to firebase
		if(props.route.params.postId !== postId){
			firebase.firestore()
			.collection("posts")
			.doc(props.route.params.uid)
			.collection("userPosts")
			.doc(props.route.params.postId)
			.collection('comments')
			.get()
			.then((snapshot) => {
				let comments = snapshot.docs.map(doc => {
					const data = doc.data(); // text, creator of comment
					const id = doc.id;

					return {id, ...data}
				})
				matchUserToComment(comments);
			})
			setPostId(props.route.params.postId);
		} else {
			matchUserToComment(comments);
		}
	}, [props.route.params.postId, props.users])


	const onCommentSend = () => {
		firebase.firestore()
		.collection("posts")
		.doc(props.route.params.uid)
		.collection("userPosts")
		.doc(props.route.params.postId)
		.collection('comments')
		.add({
			creator: firebase.auth().currentUser.uid,
			text
		})

	}

	return (
		<View style={styles.main}>
			<FlatList 
				numColumns = {1}
				horizontal = {false}
				data = {comments}
				renderItem = {({item}) => (
					<View style={styles.comments}>
						{item.user !== undefined ? 
							<Text>
								<Text style={styles.username}>{item.user.name}</Text><Text style={styles.comment}>{item.text}</Text>
							</Text>
						: null}
						

					</View>
				)}
			/>

			<View style={styles.bottom}>
				<TextInput 
					placeholder = 'Comment...'
					onChangeText = {(text) => setText(text)}
				/>

				<Button 
					onPress = {() => {onCommentSend()}}
					title="Send"
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	username: {
		fontWeight: 'bold',
	},
	comment: {
		margin: 3
	},
	comments: {
		marginLeft: 3,
		marginTop: 5
	},
	bottom: {
		flex: 1,
   		justifyContent: 'flex-end',
	},
	main: {
		flex: 1,
   		justifyContent: 'flex-end',	
	}
})

const mapStateToProps = (store) => ({
	users: store.usersState.users
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUsersData}, dispatch);


export default connect(mapStateToProps, mapDispatchProps)(Comment)