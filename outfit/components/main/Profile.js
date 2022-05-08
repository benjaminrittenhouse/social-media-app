import React from 'react'

import { StyleSheet, View, Text, Image, FlatList } from 'react-native'

import {connect} from 'react-redux'

function Profile(props){
	const { currentUser, posts, url} = props;


	return(
		<View style={styles.container}>
			<View style={styles.infoContainer}>
				<Text style={styles.profText}>{currentUser.name}</Text>
			</View>

			<View style={styles.postsContainer}>
				<FlatList 
					numColumns={3}
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
})

export default connect(mapStateToProps, null)(Profile);