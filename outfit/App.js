import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'


//import firebase from 'firebase/compat/app'

// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

//require('dotenv').config();

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  /* add here*/
};

if(firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'


const Stack = createStackNavigator();

export class App extends Component {
  constructor(props){
      super(props);
      this.state = {
        loaded: false,
      }
  }

  componentDidMount(){
      firebase.auth().onAuthStateChanged((user));
  }

  render(){
      return (
          <NavigationContainer>
              <Stack.Navigator initialRouteName="Landing">
                  <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown: false}}/>
                  <Stack.Screen name="Register" component={RegisterScreen}/>
              </Stack.Navigator>
          </NavigationContainer>
      );
  }
}

export default App
