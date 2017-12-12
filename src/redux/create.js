import { createStore, combineReducers, compose } from "redux";
import { reducers } from './modules/root';

import * as windowActions from './modules/window';

//import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

const composeEnhancers = (...args) => {
    //Debug Actions (filter out the reducer) for Redux-Devtools
    //This isn't necessary because we don't really need to filter so perfectly for debugging but
    //left here as an example of es6 Destructuring
    const { default: windowDefault, ...windowPassthrough } = windowActions;

    return typeof window !== 'undefined' ?
        composeWithDevTools({ actionCreators: { ...windowPassthrough } })(...args) :
        compose(...args);
};


export default function configureStore(preloadedState) {
    const combinedReducer = combineReducers({
        ...reducers
    });

    //const middlewares = applyMiddleware(middleware, epicMiddleware); //thunk
    const enhancers = composeEnhancers();
    const store = createStore(combinedReducer, preloadedState, enhancers);

    return { store };
}

