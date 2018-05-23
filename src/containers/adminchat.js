import React, { Component } from 'react';
import ChatBox from '../components/chatbox';
import ChannelList from '../components/channellist';
import { connect } from 'react-redux';
import { sbSetChansAction,sbSetChanStatesAction} from '../redux/modules/sendbird';

class AdminChatApp extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        const { sb } = this.props;
        this.sb = sb

        this.state = {
        };
    };

    onLeaveGroupChannel = (channelIndex) => {
        return event => {
            console.log("Leave channel (index:", channelIndex, ")");
            let channels = this.props.sendbird.channels;
            let channelStates = this.props.sendbird.channelStates;
            let channel = channels[channelIndex]

            this.sb.groupChannelLeave(channel, (response, error) => {
                if (error) {
                    console.error(error);
                    return;
                }


                channels.splice(channelIndex, 1)
                channelStates.splice(channelIndex, 1)

                this.props.sbSetChans(channels,channelStates);
            })
        }
    };

    onHideChatBox = (index) => {
        return event => {
            console.log("Hide Chatbox (index:", index, ")");
            let states = this.props.sendbird.channelStates;
            let state = states[index]
            state["show"] = false;
            
            this.props.sbSetChanStates(states);
        }
    };

    handleClickOnItem = (e, index) => {
        const chan = this.props.sendbird.channels[index];
        console.log("handleClickOnItem:", chan.name);

        let states = this.props.sendbird.channelStates;
        let state = states[index]
        state["show"] = true;
        
        this.props.sbSetChanStates(states);

    }

    render() {
        console.log("AdminChatApp rendering!!");
        // console.log("props:", this.props);

        if (this.props.sendbird.channels.length === 0) {
            return (
                <div>
                    <p> {'(connected as ' + this.props.user.userId + ')'}</p>
                </div>
            )
        }

        const boxes = this.props.sendbird.channels.map((chan, index) => {
            console.log("index:", index);
            
            const state = this.props.sendbird.channelStates[index];

            if (!state.show) {
                return null;
            }

            return ( 
                <ChatBox 
                    sb={this.sb} 
                    key={index} 
                    id={index} 
                    isAdmin={this.props.sendbird.isAdmin} 
                    name={chan.name}
                    url={chan.url}
                    channel={chan} 
                    channelState={this.props.sendbird.channelStates[index]}
                    onCloseClick={this.onLeaveGroupChannel(index)} 
                    onHideChatBox={this.onHideChatBox(index)}
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
                <p>Logged in as {this.props.user.userId}</p>
                <ChannelList data={this.props.sendbird.channels} onClick={this.handleClickOnItem}/>
               

                <div className='chat-section' style={{
                    right: '280px',
                    width:  this.props.sendbird.channels.length * 300 + 'px',
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
        sbSetChans: (channels, channelStates) => {
            console.log("sbSetChans");
            dispatch(sbSetChansAction({
                channels: channels, 
                channelStates: channelStates
            }));
        },
        sbSetChanStates: (channelStates) => {
            console.log("sbSetChanStates");
            dispatch(sbSetChanStatesAction({channelStates}));
        },

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminChatApp);
