import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'


import { View, Text } from 'react-native'


// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// redux & connecting to react native
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './components/redux/reducers'
import thunk from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(thunk))

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
// info here
};

if(firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import MainScreen from './components/main'


const Stack = createStackNavigator();

export class App extends Component {
  constructor(props){
      super(props);
      this.state = {
        loaded: false,
      }
  }

  componentDidMount(){
      firebase.auth().onAuthStateChanged((user) => {
        if(!user){
          this.setState({
            loggedIn: false,
            loaded: true,
          })
        } else {
          this.setState({
            loggedIn: true,
            loaded: true,
          })
        }
      });
  }

  render(){
      const { loggedIn, loaded } = this.state;
      if(!loaded){
          return(
              <View style = {{flex: 1, justifyContent: 'center'}}>
                <Text>Loading...</Text>
              </View>
          )
      }

      if(!loggedIn){
          return (
              <NavigationContainer>
                  <Stack.Navigator initialRouteName="Landing">
                      <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown: false}}/>
                      <Stack.Screen name="Register" component={RegisterScreen}/>
                  </Stack.Navigator>
              </NavigationContainer>
          );
      }


      return (
          // redux provider wrapped around main page
          <Provider  store={store}>
              <NavigationContainer>
                  <Stack.Navigator initialRouteName="Main">
                      <Stack.Screen name="Main" component={MainScreen} options={{headerShown: false}}/>
                  </Stack.Navigator>
              </NavigationContainer>
          </Provider>
      )


  }
}

export default App
