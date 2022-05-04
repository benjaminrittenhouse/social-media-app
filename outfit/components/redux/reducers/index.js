import { combineReducers } from 'redux'
import { user } from './user'

const Reducers = combineReducers({
	usersState: user
})

export default Reducers