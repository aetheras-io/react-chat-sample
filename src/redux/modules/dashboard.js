const DASHBOARD_LOAD = 'dashboard/LOAD';
const DASHBOARD_UNLOAD = 'dashboard/UNLOAD';

const initialState = {
    loaded: false,
    userId: "",
};

export const dashboardLoadAction = (payload) => ({ type: DASHBOARD_LOAD, payload });
export const dashboardUnloadAction = () => ({ type: DASHBOARD_UNLOAD });

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case DASHBOARD_LOAD:
            console.log('LOAD DASHBOARD');
            //return { ...state, loaded: true, userId: action.payload };
            return { ...state, loaded: true, ...action.payload };
        case DASHBOARD_UNLOAD:
            console.log('UNLOAD DASHBOARD');
            return { ...state, loaded: false };
        default:
            return state
    }
}
