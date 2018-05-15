const USER_CONNECT = 'user/connect';
const USER_DISCONNECT = 'user/disconnect';

const initialState = {
    login: false,
    userId: "",
};

export const userConnectAction = (payload) => ({ type: USER_CONNECT, payload });
export const userDisconnectAction = () => ({ type: USER_DISCONNECT });

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case USER_CONNECT:
            console.log('USER_CONNECT');
            //return { ...state, login: true, userId: action.payload };
            return { ...state, login: true, ...action.payload };
        case USER_DISCONNECT:
            console.log('USER_DISCONNECT');
            return { ...state, login: false };
        default:
            return state
    }
}
