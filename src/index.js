import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import configureStore from './redux/create';
import * as windowActions from './redux/modules/window';

const { store } = configureStore({}); //pass in initial state, take out thunk.  Used to be const { store, thunk}

console.log(process.env)
const divID = 'rchapp';
let domElement = document.getElementById(divID);
if (!domElement) {
    domElement = document.createElement("div");
    domElement.id = divID;
    document.body.appendChild(domElement);
}

//render
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    domElement
);

function connectUser(userId, nickName) {

    console.log('useridText:' + userId);
    console.log('nicknameText:' + nickName);

    store.dispatch(windowActions.windowLoadAction({
        userId: userId,
        nickName: nickName
    }));
}

function hide() {
    store.dispatch(windowActions.windowUnloadAction());
}

export { connectUser };
export { hide };

// function show() {
//     store.dispatch(windowActions.windowLoadAction("denistsai"));
// }

// function show2() {
//     store.dispatch(windowActions.windowLoadAction("tiffanyfan"));
// }

// function hide() {
//     store.dispatch(windowActions.windowUnloadAction());
// }

// export { show };
// export { show2 };
// export { hide };