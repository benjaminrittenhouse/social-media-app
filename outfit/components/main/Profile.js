import React, {useState, useEffect} from 'react'

import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
import firebase from 'firebase/compat/app'
require('firebase/firestore');
import {connect} from 'react-redux'

function Profile(props){
	const [userPosts, setUserPosts] = useState([]);
	const [user, setUser] = useState(null);
	const [following, setFollowing] = useState(false);

	useEffect(() => {
		// our profile
		if(props.route.params.uid == firebase.auth().currentUser.uid){
			setUser(currentUser);
			setUserPosts(posts);
		} else { // other user profile
			// other user information
			firebase.firestore()
			.collection("users")
			.doc(props.route.params.uid)
			.get()
			.then((snapshot) => {
				if(snapshot.exists){
					// we are able to get data from DB
					// send to the reducer
					setUser(snapshot.data());

				} else {
					console.log('Snapshot does not exist, err: profile.js');
				}
			})
			// other user posts
			firebase.firestore()
			.collection("posts")
			.doc(props.route.params.uid)
			.collection("userPosts")
			.orderBy("creation", "asc")
			.get()
			.then((snapshot) => {
				let posts = snapshot.docs.map(doc => {
					const data = doc.data();
					const id = doc.id;
					return {id, ...data};
				})

				let download = snapshot.url;

				setUserPosts(posts);
			})
		}

		// check if following in array of following
		if(props.following.indexOf(props.route.params.uid) > -1){
			setFollowing(true);
		} else {
			setFollowing(false);
		}

	}, [props.route.params.uid, props.following])

	const { currentUser, posts, url} = props;

	const onFollow = () => {
		firebase.firestore()
		.collection("following")
		.doc(firebase.auth().currentUser.uid)
		.collection("userFollowing")
		.doc(props.route.params.uid)
		.set({})
	}

	const onUnfollow = () => {
		firebase.firestore()
		.collection("following")
		.doc(firebase.auth().currentUser.uid)
		.collection("userFollowing")
		.doc(props.route.params.uid)
		.delete({})
	}

	if(user === null){
		return <View></View>
	}

	return(
		<View style={styles.container}>
			<View style={styles.infoContainer}>
				<Text style={styles.profText}>{user.name}</Text>
				{props.route.params.uid !== firebase.auth().currentUser.uid ? (
					<View>
						{following ? (
							<Button 
								title="Following"
								onPress={() => onUnfollow()}
							/>
						) : (
							<Button 
								title="Follow"
								onPress={() => onFollow()}
							/>
						)}
					</View>
				) : null}
			</View>

			<View style={styles.postsContainer}>
				<FlatList 
					numColumns={3}
					horizontal={false}
					data={userPosts}
					renderItem={({item}) => (
						<View 
							style={styles.containerImage}
						>
							<Image 
								style={styles.image}
								source={{uri: item.url}} // note
							/>
						</View>
					)}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 40,
		marginLeft: 10,
		marginRight: 10
	}, 
	infoContainer: {
		margin: 10
	},
	postsContainer: {
		flex: 1,
		marginTop: 10
	},
	image: {
		flex: 1,
		aspectRatio: 1/1
	},
	containerImage: {
		flex: 1/3,
		borderRadius: 33,
		overflow: 'hidden',
		margin: 5
	}, 
	profText: {
		fontSize: 30,
		fontWeight: 'bold'
	}
})

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser,
	posts: store.userState.posts,
	following: store.userState.following,
})

export default connect(mapStateToProps, null)(Profile);