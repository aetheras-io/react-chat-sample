const SB_CONNECT = 'sendbird/CONNECT';
const SB_DISCONNECT = 'sendbird/DISCONNECT';
const SB_SETGENERALCHAN= 'sendbird/SETGENERALCHAN';
const SB_SETCHANS = 'sendbird/SETCHANS';
const SB_SETCHANSTATES = 'sendbird/SETCHANSTATES';

const initialState = {
    connected: false,
    isAdmin: false,
    generalChannel: null,
    channels: [],
    channelStates: [],
    users: [],
};

export const sbConnectAction = (payload) => ({ type: SB_CONNECT, payload });
export const sbDisconnectAction = () => ({ type: SB_DISCONNECT });
export const sbSetGeneralChanAction = (payload) => ({ type: SB_SETGENERALCHAN, payload });
export const sbSetChansAction = (payload) => ({ type: SB_SETCHANS, payload });
export const sbSetChanStatesAction = (payload) => ({ type: SB_SETCHANSTATES, payload });

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SB_CONNECT:
            console.log('SB_CONNECT STATE');
            return { ...state, connected: true, isAdmin: action.payload.isAdmin, generalChannel: action.payload.generalChannel, channels: action.payload.channels, channelStates: action.payload.channelStates };

        case SB_DISCONNECT:
            console.log('SB_DISCONNECT STATE');
            return { ...state, connected: false };

        case SB_SETGENERALCHAN:
            console.log('SB_SETGENERALCHAN STATE');
            return { ...state, generalChannel: action.payload.generalChannel };

        case SB_SETCHANS:
            console.log('SB_SETCHANS STATE');
            return { ...state, channels: action.payload.channels, channelStates: action.payload.channelStates };

        case SB_SETCHANSTATES:
            console.log('SB_SETCHANSTATES STATE');
            return { ...state, channelStates: action.payload.channelStates };

        default:
            return state
    }
}
