import React, { Component } from 'react';
import ChatBoard from '../components/chatboard';
import ChannelList from '../components/channellist';
import { connect } from 'react-redux';
import * as sendbirdActions from '../redux/modules/sendbird';

class AdminChatApp extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        const { sb } = this.props;
        this.sb = sb

        this.state = {
            // channels: [],
            // channelStates: [],
            // users: [],
            hasError: false,
            errMsg: "",
        };

        this.init()
    };

    init = () => {
        console.log('init');

        //listen to invites
        this.sb.createHandler(
            this.onInvited,
            this.onMessageReceived,
            this.onUserJoined,
            this.onUserLeft,
        )

        //Show participated group channels
        this.sb.getGroupChannelList((list) => {
            console.log("GROUP CHANNELS: ", list);

            let channels = [];
            let channelStates = [];

            list.forEach(channel => {
                console.log('Private: ', channel);

                let channelState = {
                    messages: [],
                    newMessage: '',
                    submitting: false,
                };
                channels.push(channel);
                channelStates.push(channelState);
            });

            this.props.sbSetChans(channels,channelStates);

            this.setState({ 
                // channels: channels, 
                // channelStates: 
                // channelStates, 
                hasError: false, 
                errMsg:"",
            });
        });


    };

    onInvited = (channel, inviter, invitees) => {
        //console.log('invited!', channel, inviter);
        let channels = this.props.sendbird.channels;
        let channelStates = this.props.sendbird.channelStates;
        let channelState = {
            messages: [],
            newMessage: '',
            submitting: false,
        };
        channels.push(channel);
        channelStates.push(channelState);

        this.props.sbSetChans(channels,channelStates);
        // this.setState({ channels: channels, channelStates: channelStates })
    };

    addChannelToList = (channel) => {

    }

    onMessageReceived = (channel, message) => {
        console.log('Message: ', channel, message);
    };

    onMessageReceived = (channel, message) => {
        let id = this.props.sendbird.channels.findIndex((chan) => {
            console.log(channel.url, chan.url);
            return channel.url === chan.url;
        });
        let channelStates = this.props.sendbird.channelStates;
        channelStates[id].messages.push(message._sender.userId + ': ' + message.message);

        this.props.sbSetChanStates(channelStates);
        // this.setState({ channelStates: channelStates });
    };

    onUserJoined = (channel, user) => {
        console.log("user joined: ", user.userId);
        let users = this.props.sendbird.users;
        users.push(user)
    };

    onUserLeft = (channel, user) => {
        console.log("user left: ", user.userId);

        let channels = this.props.sendbird.channels;
        let channelStates = this.props.sendbird.channelStates;
        let channelIndex =  this.props.sendbird.channels.map((chan) => {
                        return chan.createdAt;
                    }).indexOf(channel.createdAt);


        this.sb.groupChannelLeave(channel, (response, error) => {
            if (error) {
                console.error(error);
                return;
            }


            channels.splice(channelIndex, 1);
            channelStates.splice(channelIndex, 1);

            this.props.sbSetChans(channels,channelStates);
            
            // this.setState({ 
            //     channels: channels, 
            //     channelStates: channelStates
            //  });
        })
    };

    onInputKeyDown = event => {
        const id = event.target.id;
        let channelStates = this.props.sendbird.channelStates;

        if (event.key === 'Enter') {
            channelStates[id].submitting = true;
            this.props.sbSetChanStates(channelStates);
            // this.setState({ channelStates: channelStates });

            let channel = this.props.sendbird.channels[id];
            this.sb.sendTextMessage(channel, channelStates[id].newMessage, (message, error) => {
                if (error) {
                    channelStates[id].submitting = false;

                    this.props.sbSetChanStates(channelStates);
                    // this.setState({ channelStates: channelStates });
                    console.error(error);
                    return;
                }

                channelStates[id].submitting = false;
                channelStates[id].newMessage = "";
                channelStates[id].messages.push('me: ' + message.message);

                this.props.sbSetChanStates(channelStates);
                // this.setState({ channelStates: channelStates });
            });
        } else {
            channelStates[id].newMessage = channelStates[id].newMessage + event.key;

            this.props.sbSetChanStates(channelStates);
            // this.setState({ channelStates: channelStates });
        }
    };

    onInviteUser = event => {
        console.log(event.target.value);
        this.sb.createPrivateChannel([event.target.value], 'private chat 1', (a) => { console.log(a); });
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
                // this.setState({ 
                //     channels: channels, 
                //     channelStates: channelStates
                //  });
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
            // this.setState({
            //     channelStates: states
            // });
        }
    };

    handleClickOnItem = (e, index) => {
        const chan = this.props.sendbird.channels[index];
        console.log("handleClickOnItem:", chan.name);

        let states = this.props.sendbird.channelStates;
        let state = states[index]
        state["show"] = true;
        
        this.props.sbSetChanStates(states);
        // this.setState({
        //     channelStates: states
        // });

    }

    componentWillUnmount = () => {
        console.log('AdminChat Unmount');
        this.sb.disconnect(() => {
            console.log('disconnected');
            this.props.sbDisconnect();
        })
    };

    render() {
        console.log("state:", this.state);
        const {userId} = this.props;


        if (this.state.hasError) {
            return (
                <div>
                    <p>Error has occured: {this.state.errMsg}</p>
                    <button id="retryBtn" onClick={this.init}>Retry</button>
                </div>
            )
        }

        if (this.props.sendbird.channels.length === 0) {
            return (
                <div>
                    <p> {'(connected as ' + userId + ')'}</p>
                </div>
            )
        }

        const boxes = this.props.sendbird.channels.map((chan, index) => {
            console.log("index:", index);
            
            const state = this.props.sendbird.channelStates[index];

            if (!state.show) {
                return null;
            }

            return <ChatBoard name={chan.name} key={index} url={chan.url} id={index} onInputKeydown={this.onInputKeyDown} onCloseClick={this.onLeaveGroupChannel(index)} onHideChatBox={this.onHideChatBox(index)} {...state} />;
        });

        return (
            <div>
                <p>Logged in as {userId}</p>
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

const mapStateToProps = ({ sendbird }) => ({
    sendbird
});

const mapDispatchToProps =(dispatch) => {
    return {
        sbDisconnect: () => {
            console.log("sbDisconnect"); 
            dispatch(sendbirdActions.sbDisconnectAction());
        },
        sbSetChans: (channels, channelStates) => {
            console.log("sbSetChans");
            dispatch(sendbirdActions.sbSetChansAction({
                channels: channels, 
                channelStates: channelStates
            }));
        },
        sbSetChanStates: (channelStates) => {
            console.log("sbSetChanStates");
            dispatch(sendbirdActions.sbSetChanStatesAction({channelStates}));
        },

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminChatApp);
