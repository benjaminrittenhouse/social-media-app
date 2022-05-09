import React, {useState, useEffect} from 'react'

import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
import firebase from 'firebase/compat/app'
import 'firebase/firestore'
import {connect} from 'react-redux'

function Feed(props){
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		let posts = [];
		if(props.usersLoaded == props.following.length){

			for (const [index, element] of props.following.entries()) {
    			// const [index, element] = [0, 'a'] on 1st iteration, then [1, 'b'], etc. 
    			const user = props.users.find(el => el.uid === element);
    			if(user != undefined){
    				console.log(`Posts: ${posts}`);
    				console.log("User posts:" + user.posts);
    				posts = [...posts, ...user.posts];
    			}
			}

			posts.sort(function(x, y) {
				return x.creation - y.creation;
			})

			setPosts(posts);
		}

	}, [props.usersLoaded])

	//const { currentUser, posts, url} = props;

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
	following: store.userState.following,
	users: store.usersState.users,
	usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Feed);