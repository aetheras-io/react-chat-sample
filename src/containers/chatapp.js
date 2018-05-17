import React, { Component } from 'react';
import ChatBox from '../components/chatbox';
import ChannelList from '../components/channellist';
// import { ChatToken } from './mocks/api';

class ChatApp extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        //const { userId, nickName, chatId } = this.props;
        const { sb } = this.props;

        this.sb = sb

        //const name = localStorage.getItem('name') || '';
        this.state = {
            connected: false,
            // userId: userId,
            // nickName: nickName,
            // isAdmin: false,
            // generalChannel: null,
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

    componentWillUnmount = () => {
        console.log('Chat Unmount');
        this.sb.disconnect(() => {
            console.log('disconnected');
        })
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

            this.sb.channelLeave(channel, (response, error) => {
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
            })
        }
    };

    onHideChatBox = (index) => {
        return event => {
            console.log("Hide Chatbox (index:", index, ")");
            let states = this.state.channelStates;
            let state = states[index]
            state["show"] = false;
            
            this.setState({
                channelStates: states
            });
        }
    };

    handleClickOnItem = (e, index) => {
        const chan = this.state.channels[index];
        console.log("handleClickOnItem:", chan.name);

        let states = this.state.channelStates;
        let state = states[index]
        state["show"] = true;
        
        this.setState({
            channelStates: states
        });

    }

    render() {
        console.log("state:", this.state);

        let adminSection = (      
            <div>          
                {/* {this.state.isAdmin ? <button id="showDashBtn" onClick={this.props.showDashboard}>Show Admin Dashboard</button> : null}
                {this.state.isAdmin ? <button id="hideDashBtn" onClick={this.props.hideDashboard}>Hide Admin Dashboard</button> : null}
                <hr />
                {this.props.dashboard.loaded ? <AdminPanel sb={this.sb} generalChannel={this.state.generalChannel} /> : null} */}
                 <ChannelList data={this.state.channels} onClick={this.handleClickOnItem}/>
            </div  >
        );

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
                    <p>{this.state.connected ? '(connected as ' + this.state.userId + ')' : '(waiting)'}...</p>
                    {/* {this.state.users.map((u, i) => { return <button key={i} value={u.userId} onClick={this.onInviteUser}>{u.userId}</button> })} */}
                    {adminSection}
                </div>
            )
        }

        const boxes = this.state.channels.map((chan, index) => {
            console.log("index:", index);
            
            const state = this.state.channelStates[index];

            if (this.state.idAdmin && !state.show) {
                return null;
            }

            return <ChatBox name={chan.name} key={index} url={chan.url} id={index} onInputKeydown={this.onInputKeyDown} onCloseClick={this.onLeaveGroupChannel(index)} onHideChatBox={this.onHideChatBox(index)} {...state} />
        });

        return (
            <div>
                <p>Logged in as {this.state.userId}</p>
                {adminSection}
               

                <div className='chat-section' style={{
                    right: '280px',
                    width:  this.state.channels.length * 300 + 'px',
                }}>
                    {boxes}
                </div>
            </div>
        );
    }
}

export default ChatApp