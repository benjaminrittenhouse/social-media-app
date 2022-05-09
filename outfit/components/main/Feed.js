import React, {useState, useEffect} from 'react'

import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
import firebase from 'firebase/compat/app'
import 'firebase/firestore'
import {connect} from 'react-redux'

function Feed(props){
	const [posts, setPosts] = useState([]);
	var followingButNoPosts = true;

	useEffect(() => {
		let posts = [];
		if(props.usersFollowingLoaded == props.following.length){

			for (const [index, element] of props.following.entries()) {
    			// const [index, element] = [0, 'a'] on 1st iteration, then [1, 'b'], etc. 
    			const user = props.users.find(el => el.uid === element);
    			if(user != undefined){
    				console.log("User posts:");
    				console.dir(user.posts)
    				if(user.posts != undefined){ // user has posts, handles no posts error
						posts = [...posts, ...user.posts];
    				}
    			}
			}

			posts.sort(function(x, y) {
				return x.creation - y.creation;
			})

			setPosts(posts);
		}

	}, [props.usersFollowingLoaded])


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
	users: store.usersState.users,
	usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})

export default connect(mapStateToProps, null)(Feed);