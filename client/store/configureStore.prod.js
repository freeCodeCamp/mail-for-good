import { createStore, compose, applyMiddleware } from 'redux';
import persistState from 'redux-localstorage';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  const middewares = [
    thunkMiddleware
  ];

  return createStore(rootReducer, initialState, compose(
    applyMiddleware(...middewares),
    // Save subset of state to local storage
    persistState(['activeAccount'])
    )
  );
}
