import React, { Component } from 'react';
import ChatBox from '../components/chatbox';
import ChatAPI from '../utils/chatapi';
// import { ChatToken } from './mocks/api';

class ChatApp extends Component {
    constructor(props) {
        super(props);

        const { userId, chatId } = this.props;
        this.sb = new ChatAPI(chatId)

        //const name = localStorage.getItem('name') || '';
        this.state = {
            connected: false,
            userId: userId,
            channels: [],
            channelStates: [],
            users: [],
        };
    };

    componentWillMount = () => {
        console.log('Chat Mount');
        this.sb.connect(this.state.userId, '', () => {
            this.setState({ connected: true });

            //listen to invites
            this.sb.createHandler(
                this.onInvited,
                this.onMessageReceived,
                this.onUserJoined,
                this.onUserLeft,
            )

            //find and join general channel
            this.sb.getOpenChannelList((list) => {
                //console.log("OPEN CHANNELS: ", list)
                let generalChannel = list.find((channel) => {
                    return channel.channelId = "general";
                })

                generalChannel.enter((response, error) => {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    console.log('joined channel: ', generalChannel.name);
                    // let chanList = this.state.channels;
                    // chanList.push(generalChannel);

                    this.sb.getUsersInChannel(generalChannel, (list) => {
                        let filter = list.filter(u => {
                            return u.userId !== this.state.userId && u.connectionStatus === 'online';
                        })

                        this.setState({ users: filter })
                    });
                })
            });

            //leave all private channels
            this.sb.getGroupChannelList((list) => {
                list.forEach(channel => {
                    console.log('Private: ', channel);
                    channel.leave();
                });
            });

            this.sb.getGroupChannelList((list) => {
                console.log("GROUP CHANNELS: ", list);
            });

            // //find friend to invite
            // this.sb.getUserList((list) => {
            //     //console.log("USER LIST:", list);
            //     let filter = list.filter(u => {
            //         return u.userId !== this.state.userId && u.connectionStatus === 'online';
            //     })
            //     if (filter.length > 0) {
            //         let friend = filter[0];

            //     }
            // })
        });

        // //this.initChat();
        // // if (this.state.loggedIn) {
        // //     this.getToken();
        // // }
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


    render() {
        if (this.state.channels.length === 0) {
            return (
                <div>
                    <p>{this.state.connected ? '(connected as ' + this.state.userId + ')' : '(waiting)'}...</p>
                    {this.state.users.map((u, i) => { return <button key={i} value={u.userId} onClick={this.onInviteUser}>{u.userId}</button> })}
                </div>
            )
        }

        // const messages = this.state.messages.map(message => {
        //     return (
        //         <li key={message.sid} ref={this.newMessageAdded}>
        //             <b>{message.author}:</b> {message.body}
        //         </li>
        //     );
        // });


        const boxes = this.state.channels.map((chan, index) => {
            return <ChatBox key={index} id={index} onInputKeydown={this.onInputKeyDown} {...this.state.channelStates[index]} />
        });

        return (
            <div>
                <p>Logged in as {this.state.userId}</p>
                {boxes}
            </div>
        );
    }
}

export default ChatApp;