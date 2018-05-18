import React, { Component } from 'react';
import ChatBox from '../components/chatbox';
import BoxTop from '../components/boxtop';
// import { ChatToken } from './mocks/api';

class CustomerChatApp extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        const { sb } = this.props;

        this.sb = sb

        this.state = {
            channels: [],
            channelStates: [],
            users: [],
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

            let channels = this.state.channels;
            let channelStates = this.state.channelStates;

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


            this.setState({ 
                channels: channels, 
                channelStates: 
                channelStates, 
                hasError: false, 
                errMsg:"",
            });
        });


    };

    onInvited = (channel, inviter, invitees) => {
        //console.log('invited!', channel, inviter);
        let channels = this.state.channels;
        let channelStates = this.state.channelStates;
        let channelState = {
            messages: [],
            newMessage: '',
            submitting: false,
        };
        channels.push(channel);
        channelStates.push(channelState);
        this.setState({ channels: channels, channelStates: channelStates })
    };

    addChannelToList = (channel) => {

    }

    onMessageReceived = (channel, message) => {
        console.log('Message: ', channel, message);
    };

    onMessageReceived = (channel, message) => {
        let id = this.state.channels.findIndex((chan) => {
            console.log(channel.url, chan.url);
            return channel.url === chan.url;
        });
        let channelStates = this.state.channelStates;
        channelStates[id].messages.push(message._sender.userId + ': ' + message.message);
        this.setState({ channelStates: channelStates });
    };

    onUserJoined = (channel, user) => {
        console.log("user joined: ", user.userId);
        let users = this.state.users;
        users.push(user)
    };

    onUserLeft = (channel, user) => {
        console.log("user left: ", user.userId);
    };

    onInputKeyDown = event => {
        const id = event.target.id;
        let channelStates = this.state.channelStates;

        if (event.key === 'Enter') {
            channelStates[id].submitting = true;
            this.setState({ channelStates: channelStates });

            let channel = this.state.channels[id];
            this.sb.sendTextMessage(channel, channelStates[id].newMessage, (message, error) => {
                if (error) {
                    channelStates[id].submitting = false;
                    this.setState({ channelStates: channelStates });
                    console.error(error);
                    return;
                }

                channelStates[id].submitting = false;
                channelStates[id].newMessage = "";
                channelStates[id].messages.push('me: ' + message.message);
                this.setState({ channelStates: channelStates });
            });
        } else {
            channelStates[id].newMessage = channelStates[id].newMessage + event.key;
            this.setState({ channelStates: channelStates });
        }
    };

    onInviteUser = event => {
        console.log(event.target.value);
        this.sb.createPrivateChannel([event.target.value], 'private chat 1', (a) => { console.log(a); });
    };

    onLeaveGroupChannel = (channelIndex) => {
        return event => {
            console.log("Leave channel (index:", channelIndex, ")");
            let channels = this.state.channels;
            let channelStates = this.state.channelStates;
            let channel = channels[channelIndex]

            this.sb.groupChannelLeave(channel, (response, error) => {
                if (error) {
                    console.error(error);
                    return;
                }


                channels.splice(channelIndex, 1)
                channelStates.splice(channelIndex, 1)
                this.setState({ 
                    channels: channels, 
                    channelStates: channelStates
                 });
            });
        }
    };

    componentWillUnmount = () => {
        console.log('CustomerChat Unmount');
        const {generalChannel} = this.props;

        //Leave general channel to avoid matching again
        this.sb.openChannelExit(generalChannel, (response, error) => {
            if (error) {
                console.error(error);
                return;
            }

            console.log("response:", response);

            //Leave all the group channel

            this.state.channels.map((channel, index) => {
                console.log("channel: ",channel);

                this.sb.groupChannelLeave(channel, (response, error) => {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    console.log("response:", response);

                    this.sb.disconnect(() => {
                        console.log('disconnected');
                    })
                })
            });
        });
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

        if (this.state.channels.length === 0) {
            return (
                <div>
                    <p>Waiting for your service agent...</p>
                </div>
            )
        }

        const boxes = this.state.channels.map((chan, index) => {
            console.log("index:", index);
            
            const state = this.state.channelStates[index];

            if (this.state.idAdmin && !state.show) {
                return null;
            }

            return ( 
                <div  key={index}>
                    <BoxTop name={'Logged in as ' + userId}  />
                    <ChatBox name={chan.name} url={chan.url} id={index} onInputKeydown={this.onInputKeyDown} {...state} />
                </div>
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

export default CustomerChatApp;