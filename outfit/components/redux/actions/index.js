import {USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE} from '../constants/index'

import firebase from 'firebase/compat/app';
import getDatabase from 'firebase/compat/database'

import { doc, onSnapshot } from "firebase/firestore";



export function fetchUser(){
	return((dispatch) => {
		firebase.firestore()
			.collection("users")
			.doc(firebase.auth().currentUser.uid)
			.get()
			.then((snapshot) => {
				if(snapshot.exists){
					// we are able to get data from DB
					// send to the reducer
					dispatch({type : USER_STATE_CHANGE, currentUser: snapshot.data()}) // update state of current user
				} else {
					console.log('Snapshot does not exist, err: actions/index.js');
				}
			})
	})
}

export function fetchUserPosts(){
	return((dispatch) => {
		firebase.firestore()
			.collection("posts")
			.doc(firebase.auth().currentUser.uid)
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

				dispatch({type : USER_POSTS_STATE_CHANGE, posts, download})
			})
	})
}

export function fetchUserFollowing(){
	return((dispatch) => {
		firebase.firestore()
			.collection("following")
			.doc(firebase.auth().currentUser.uid)
			.collection("userFollowing")
			.onSnapshot((snapshot) => {
				let following = snapshot.docs.map(doc => {
					const id = doc.id;
					return id
				})

				let download = snapshot.url;

				dispatch({type : USER_FOLLOWING_STATE_CHANGE, following})
				for(let i = 0; i < following.length; i++){
					dispatch(fetchUsersData(following[i]));
				}

			})
	})
}

export function fetchUsersData(uid){
	return((dispatch, getState) => {
		// tries to see if an element with the UID exists within array (followers feed)
		const found = getState().usersState.users.some(el => el.uid === uid);

		if(!found){
			firebase.firestore()
			.collection("users")
			.doc(uid)
			.get()
			.then((snapshot) => {
				if(snapshot.exists){
					let user = snapshot.data();
					user.uid = snapshot.id;

					dispatch({type : USERS_DATA_STATE_CHANGE, user}) // update state of current user
					dispatch(fetchUsersFollowingPosts(user.uid));
				} else {
					console.log('Snapshot does not exist, err: actions/index.js');
				}
			})
		}
	})
}


export function fetchUsersFollowingPosts(uid){
	return((dispatch, getState) => {
		firebase.firestore()
			.collection("posts")
			.doc(uid)
			.collection("userPosts")
			.orderBy("creation", "asc")
			.get()
			.then((snapshot) => {
				
				if(snapshot.docs[0]){
					const uid =  snapshot.docs[0].ref.path.split('/')[1];

					const user = getState().usersState.users.find(el => el.uid === uid);

					let posts = snapshot.docs.map(doc => {
						const data = doc.data();
						const id = doc.id;
						return {id, ...data, user};
					})

					let download = snapshot.url;

					dispatch({type : USERS_POSTS_STATE_CHANGE, posts, uid})
				} else {
					let posts = null;
					const uid = null;
					dispatch({type : USERS_POSTS_STATE_CHANGE, posts, uid})
				}
				
			})
	})
}





