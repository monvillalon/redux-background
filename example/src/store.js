import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import background from '../../src/';

function appReducer(state = {}, action) {
  return state;
}

const reducer = combineReducers({
  app: appReducer,
  background: background.reducer,
});

export default createStore(reducer, composeWithDevTools(applyMiddleware(background.middleware)));




