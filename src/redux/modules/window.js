const WINDOW_LOAD = 'window/LOAD';
const WINDOW_UNLOAD = 'window/UNLOAD';
const WINDOW_SET_ON_ERROR = 'window/SET_ON_ERROR';

const initialState = {
    loaded: false,
    userId: "",
    onError: (error)=>{}
};

export const windowLoadAction = (payload) => ({ type: WINDOW_LOAD, payload });
export const windowUnloadAction = () => ({ type: WINDOW_UNLOAD });
export const windowSetOnErrorAction = (payload) => ({ type: WINDOW_SET_ON_ERROR, payload });

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case WINDOW_LOAD:
            console.log('LOAD STATE');
            //return { ...state, loaded: true, userId: action.payload };
            return { ...state, loaded: true, ...action.payload };
        case WINDOW_UNLOAD:
            console.log('UNLOAD STATE');
            return { ...state, loaded: false };
        case WINDOW_SET_ON_ERROR:
            return {...state, onError: action.payload};
        default:
            return state
    }
}
