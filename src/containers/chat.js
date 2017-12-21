import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatBox from '../components/chatbox';
// import ChatAPI from '../utils/chatapi';
import * as dashbarodActions from '../redux/modules/dashboard';
// import { ChatToken } from './mocks/api';

class ChatApp extends Component {
    constructor(props) {
        super(props);

        console.log(props);
        props.test();

        //const { userId, nickName, chatId } = this.props;
        const { userId, nickName, sb } = this.props;
        // this.sb = new ChatAPI(chatId)
        this.sb = sb

        //const name = localStorage.getItem('name') || '';
        this.state = {
            connected: false,
            userId: userId,
            nickName: nickName,
            isAdmin: false,
            channels: [],
            channelStates: [],
            users: [],
            hasError: false,
            errMsg: ""
        };

        this.init()
    };

    init = () => {
        console.log('init');
        //this.sb.connect(this.state.userId, '', () => {
        this.sb.connect(this.state.userId, this.state.nickName, () => {
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


                let callback = (response, error) => {
                    if (error) {
                        console.log(error);
                        this.setState({ hasError: true, errMsg: error })
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
                        this.setState({ channels: channels, channelStates: channelStates, hasError: false })

                        //check whether this user is an admin (operator of general open channel)
                        let isOperator = generalChannel.isOperatorWithUserId(this.state.userId)
                        this.setState({ isAdmin: isOperator })
                    });
                }

                generalChannel.enter(callback)
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
                this.setState({ channels: channels, channelStates: channelStates })
            })
        }
    };

    render() {
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
            console.log("index:", index)
            return <ChatBox name={chan.name} key={index} url={chan.url} id={index} onInputKeydown={this.onInputKeyDown} onCloseClick={this.onLeaveGroupChannel(index)} {...this.state.channelStates[index]} />
        });

        return (
            <div>
                <p>Logged in as {this.state.userId}</p>
                {this.state.isAdmin ? <button id="showDashBtn" onClick={this.props.showDashboard}>Show Admin Dashboard</button> : null}
                {this.state.isAdmin ? <button id="hideDashBtn" onClick={this.props.hideDashboard}>Hide Admin Dashboard</button> : null}
                <hr />
                {boxes}

            </div>
        );
    }
}

//export default ChatApp;

const mapStateToProps = ({ dashboard }) => ({
    dashboard,
})

const mapDispatchToProps = (dispatch) => {

    return {
        test: () => {
            console.log("hello");
            dispatch({ type: 'some action' });
        },

        showDashboard: () => {
            console.log("showDashboard");
            dispatch(dashbarodActions.dashboardLoadAction());
        },

        hideDashboard: () => {
            console.log("hideDashoard");
            dispatch(dashbarodActions.dashboardUnloadAction())
        }
    }

}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatApp)