import { USER_STATE_CHANGE } from '../constants/index'

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