import React, {useState, useEffect} from 'react'

import { StyleSheet, View, Text, Image, FlatList, Button, Header } from 'react-native'
import firebase from 'firebase/compat/app'
import 'firebase/firestore'
import {connect} from 'react-redux'

function Feed(props){
	const [posts, setPosts] = useState([]);
	const [liked, setLikeStatus] = useState(false);
	var followingButNoPosts = true;

	useEffect(() => {
		if(props.usersFollowingLoaded == props.following.length && props.following.length !== 0){
			props.feed.sort(function(x, y) {
				return x.creation - y.creation;
			})

			setPosts(props.feed);

			console.log("PROPS FEED:");
			console.dir(props.feed);

		}
	}, [props.usersFollowingLoaded, props.feed])



	const onLikePress = (userId, postId) => {
		console.log("adding " + firebase.auth().currentUser.uid + " to " + userId + "'s post: " + postId);
		setLikeStatus(true);
		console.log("User liked this post? " + liked);

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
		setLikeStatus(false);
		console.log("removing " + firebase.auth().currentUser.uid + " from " + userId + "'s post: " + postId);
		console.log("User liked this post? " + liked);
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
				<View style={styles.headerContainer}>
					<Text style={styles.headerText}>Home</Text>
				</View>
				<FlatList 
				  	showsVerticalScrollIndicator={false}
  					showsHorizontalScrollIndicator={false}
					numColumns={1}
					horizontal={false}
					data={posts}
					renderItem={({item}) => (
						<View 
							style={styles.containerImage}
						>
							
							
							<Image 
								style={styles.image}
								source={{uri: item.url}} // note
							/>

							<Text style={styles.caption}>
								<Text style={styles.at}>@{item.user.name}</Text><Text style={styles.captionText}>{item.caption}</Text>
							</Text>
							
							<Text  
								style={styles.viewComments}
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
	}, 
	postsContainer: {
		flex: 1,
	//	marginTop: 10
	},
	image: {
		height: 300,
        flex: 1,
        width: null,
	},
	containerImage: {
		flex: 1,
		overflow: 'hidden',
		marginBottom: 30
	}, 
	profText: {
		fontSize: 30,
		fontWeight: 'bold'
	},
	user: {
		fontSize: 20,
		marginLeft: 20,
		marginBottom: 5
	},
	viewComments: {
		color: 'gray',
		marginLeft: 30
	},
	caption: {
		fontSize: 14,
		marginLeft: 10,
		marginBottom: 5
	},
	at: {
		fontWeight: 'bold',
	},
	captionText: {
		marginLeft: 5,
	},
	headerText: {
		fontSize: 35,
		margin: 5,
		fontWeight: 'bold',
		fontStyle: 'italics',
	},
	headerContainer: {
		backgroundColor: '#0c95f0',
	}
})

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser,
	following: store.userState.following,
	feed: store.usersState.feed,
	usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})

export default connect(mapStateToProps, null)(Feed);