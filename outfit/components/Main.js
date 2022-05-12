import React, { Component } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData} from './redux/actions/index'
import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import SearchScreen from './main/Search'

import firebase from 'firebase/compat/app'




import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
	return(null)
}

export class Main extends Component {
	componentDidMount(){
		this.props.clearData();
		this.props.fetchUser();
		this.props.fetchUserPosts();
		this.props.fetchUserFollowing();
	}

	render(){

		return (
		    <Tab.Navigator initialRouteName="Feed" labeled = {false}
		   	>
		      	<Tab.Screen name="Feed" component={FeedScreen} 
		      	options={{
		      		tabBarIcon: ({ color, size }) => (
		      			<MaterialCommunityIcons name = "tshirt-crew" color={color} size={26} />
		      		),
		      		headerShown: false,
		      	}}/>
		      	<Tab.Screen name="Search" component={SearchScreen}  navigation={this.props.navigation}
		      	options={{
		      		tabBarIcon: ({ color, size }) => (
		      			<MaterialCommunityIcons name = "account-search" color={color} size={26} />
		      		),
		      		headerShown: false,
		      	}}/>
		      	<Tab.Screen name="AddContainer" component={EmptyScreen} 
			      	listeners = {({ navigation }) => ({
			      		tabPress: event => {
			      			event.preventDefault();
			      			navigation.navigate("Add")
			      		}
			      	})}
			      	options={{
			      		tabBarIcon: ({ color, size }) => (
			      			<MaterialCommunityIcons name = "camera" color={color} size={26} />
			      		),
		      	}}/>
		      	<Tab.Screen name="Profile" component={ProfileScreen} 

		      	listeners = {({ navigation }) => ({
			      		tabPress: event => {
			      			event.preventDefault();
			      			navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
			      		}
			      	})}
		      	
		      	options={{
		      		tabBarIcon: ({ color, size }) => (
		      			<MaterialCommunityIcons name = "account" color={color} size={26} />
		      		),
		      		headerShown: false,
		      	}}/>
			</Tab.Navigator>
		)
	}
}

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts, fetchUserFollowing, clearData}, dispatch);


export default connect(mapStateToProps, mapDispatchProps)(Main)