import React, { Component } from 'react';
import ChatBox from '../components/chatbox';
import { connect } from 'react-redux';
import { sbSetChanStatesAction} from '../redux/modules/sendbird';
// import { ChatToken } from './mocks/api';

class CustomerChatApp extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        const { sb } = this.props;
        this.sb = sb

        this.state = {};
    };

    render() {
        console.log("CustomerChatApp rendering!");
        // console.log("state:", this.state);

        if (this.props.sendbird.channels.length === 0) {
            return (
                <div>
                    <p>Waiting for your service agent...</p>
                </div>
            )
        }

        const boxes = this.props.sendbird.channels.map((chan, index) => {
            console.log("index:", index);

            return ( 
                <ChatBox 
                    sb={this.sb} 
                    key={index} 
                    id={index} 
                    isAdmin={this.props.sendbird.isAdmin} 
                    name={'Logged in as ' + this.props.user.userId} 
                    channel={chan} 
                    channelState={this.props.sendbird.channelStates[index]}
                    submitChannelState={
                        (id, state)=> {
                            let states = this.props.sendbird.channelStates;
                            states[id] = state;
                            this.props.sbSetChanStates(states);
                        }
                    }
                />
            );
        });

        return (
            <div>
                <div className='chat-section' style={{
                    width: '100%',
                    right: '0'
                }}>
                    {boxes}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ user, sendbird }) => ({
    user, sendbird
});

const mapDispatchToProps =(dispatch) => {
    return {
        sbSetChanStates: (channelStates) => {
            console.log("sbSetChanStates");
            dispatch(sbSetChanStatesAction({channelStates}));
        },

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerChatApp);