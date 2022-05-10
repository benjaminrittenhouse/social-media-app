import React, {useState, useEffect} from 'react'

import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
import firebase from 'firebase/compat/app'
import 'firebase/firestore'
import {connect} from 'react-redux'

function Feed(props){
	const [posts, setPosts] = useState([]);
	var followingButNoPosts = true;

	useEffect(() => {
		if(props.usersFollowingLoaded == props.following.length && props.following.length !== 0){
			props.feed.sort(function(x, y) {
				return x.creation - y.creation;
			})

			setPosts(props.feed);

		}

		console.log("POSTS");
		console.dir(posts);
	}, [props.usersFollowingLoaded, props.feed])


	const onLikePress = (userId, postId) => {
		firebase.firestore()
			.collection("posts")
			.doc(userId)
			.collection("userPosts")
			.doc(postId)
			.collection("likes")
			.doc(firebase.auth().currentUser.uid)
			.set({})
	}

	const onDislikePress = (userId, postId) => {
		firebase.firestore()
			.collection("posts")
			.doc(userId)
			.collection("userPosts")
			.doc(postId)
			.collection("likes")
			.doc(firebase.auth().currentUser.uid)
			.delete()
	}


	if(posts.length !== 0){ // there are posts to display
		return(
		<View style={styles.container}>
			<View style={styles.postsContainer}>
				<FlatList 
					numColumns={1}
					horizontal={false}
					data={posts}
					renderItem={({item}) => (
						<View 
							style={styles.containerImage}
						>
							<Text style={styles.container}>{item.user.name}</Text>
							<Image 
								style={styles.image}
								source={{uri: item.url}} // note
							/>



							{ item.currentUserLike ? 
								(
									<Button 
										title="Dislike"
										onPress={() => onDislikePress(item.user.uid, item.id)}
									/>
								) 
								:
								(
									<Button 
										title="Like"
										onPress={() => onLikePress(item.user.uid, item.id)}
									/>
								)
							}

							<Text  
								onPress={() => props.navigation.navigate('Comment', 
									{postId: item.id, uid: item.user.uid}
								)}>
							View comments...</Text>
						</View>
					)}
				/>
			</View>
		</View>
		)
	} else { // no posts to display
		if(props.following.length > 0) { // is following user(s) but said user(s) do not have any posts
			return (
				<View>

				</View>
			)
		} else { // not following anyone
			return(
				<View>
					<Text style={{fontSize: 50, alignContent: 'center', justifyContent: 'center', textAlign: 'center'}}>You are not following anyone.</Text>
				</View>
			)
		}
	
	}
	
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
	following: store.userState.following,
	feed: store.usersState.feed,
	usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})

export default connect(mapStateToProps, null)(Feed);