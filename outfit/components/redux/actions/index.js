import {USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA, USERS_LIKES_STATE_CHANGE} from '../constants/index'

import firebase from 'firebase/compat/app';
import getDatabase from 'firebase/compat/database'

import { doc, onSnapshot } from "firebase/firestore";


// clear redux whne they logout
export function clearData(){
	return ((dispatch) => {
		dispatch({type: CLEAR_DATA})
	})
}


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
			.orderBy("creation", "desc")
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
					dispatch(fetchUsersData(following[i], true));
				}

			})
	})
}

export function fetchUsersData(uid, getPosts){
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
				} else {
					console.log('Snapshot does not exist, err: actions/index.js');
				}
			})

			if(getPosts){
				dispatch(fetchUsersFollowingPosts(uid));
			}
		}
	})
}


export function fetchUsersFollowingPosts(uid){
	return((dispatch, getState) => {
		firebase.firestore()
			.collection("posts")
			.doc(uid)
			.collection("userPosts")
			.orderBy("creation", "desc")
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

					for(let i = 0; i < posts.length; i++){
						dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
					}
					dispatch({type : USERS_POSTS_STATE_CHANGE, posts, uid})
				} else {
					let posts = [];
					const uid = null;
					dispatch({type : USERS_POSTS_STATE_CHANGE, posts, uid})
				}
				
			})
	})
}


export function fetchUsersFollowingLikes(uid, postId){
	return((dispatch, getState) => {
		firebase.firestore()
			.collection("posts")
			.doc(uid)
			.collection("userPosts")
			.doc(postId)
			.collection("likes")
			.doc(firebase.auth().currentUser.uid)
			.onSnapshot((snapshot) => {
			//	if(snapshot.docs[0]){
					// may have to change
					const postId =  snapshot.id;

					let currentUserLike = false;

					if(snapshot.exists){
						console.log("liked post, setting to true");
						currentUserLike = true;
					} else {
						console.log("doesn't exist, currentUserLike is now " + currentUserLike);
					}


					dispatch({type : USERS_LIKES_STATE_CHANGE, postId, currentUserLike})
			/*	} else {
					let posts = null;
					const uid = null;
					dispatch({type : USERS_LIKES_STATE_CHANGE, postId, uid})
				}*/
				
			})
	})
}



