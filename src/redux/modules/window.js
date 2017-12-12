const WINDOW_LOAD = 'window/LOAD';
const WINDOW_UNLOAD = 'window/UNLOAD';

const initialState = {
    loaded: false,
    userId: "",
};

export const windowLoadAction = (payload) => ({ type: WINDOW_LOAD, payload });
export const windowUnloadAction = () => ({ type: WINDOW_UNLOAD });

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case WINDOW_LOAD:
            console.log('LOAD STATE');
            return { ...state, loaded: true, userId: action.payload };
        case WINDOW_UNLOAD:
            console.log('UNLOAD STATE');
            return { ...state, loaded: false };
        default:
            return state
    }
}
