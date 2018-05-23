import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import configureStore from './redux/create';
import {windowSetOnErrorAction} from './redux/modules/window';
import {userConnectAction, userDisconnectAction} from './redux/modules/user';

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

    store.dispatch(userConnectAction({
        userId: userId,
        nickName: nickName
    }));
}

function hide() {
    store.dispatch(userDisconnectAction());
}

function setOnError(callback) {
    store.dispatch(windowSetOnErrorAction(callback));
}


export { connectUser };
export { hide };
export { setOnError };

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