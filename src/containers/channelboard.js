import React, { Component } from 'react';
import BoardTop from '../components/boardtop';
import AdminChatApp from './adminchat';
import CustomerChatApp from './customerchat';
import ChatAPI from '../utils/chatapi';
import { connect } from 'react-redux';
import * as sendbirdActions from '../redux/modules/sendbird';
import * as userActions from '../redux/modules/user';
import * as windowActions from '../redux/modules/window';

const FADE_IN = "channel-board sb-fade-in";
const FADE_OUT = "channel-board sb-fade-out";

class ChannelBoard extends Component {
    constructor(props) {
        super(props);

        this.sb = new ChatAPI('FDA75C2D-F0F0-43A6-A5A8-B7CCC998AE17');

        this.state={

        };

        this.init();
    };

    init = () => {
        console.log('init');

        this.sb.connect(this.props.user.userId, this.props.user.nickName, () => {

            //listen to invites
            this.sb.createHandler(
                this.onInvited,
                this.onMessageReceived,
                this.onUserJoined,
                this.onUserLeft,
            )

            //find and join general channel
            this.sb.getOpenChannelInfo("general",(generalChannel) => {
                console.log("generalChannel: ", generalChannel);

                let callback = (response, error) => {

                    console.log("response:", response);
                    if (error) {
                        console.log(error);
                        
                        //#TODO: Handle Error & Retry!
                        // this.setState({ 
                        //     hasError: true, 
                        //     errMsg: JSON.stringify(error) 
                        // });
                        return;
                    }
                    console.log('joined channel: ', generalChannel.name);

                    //check whether this user is an admin (operator of general open channel)
                    let isOperator = generalChannel.isOperatorWithUserId(this.props.user.userId);
                    console.log("operators:", generalChannel.operators);

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

                        this.props.sbConnect(isOperator, generalChannel, channels, channelStates);
                    });
                }

                generalChannel.enter(callback);
            });

        });
    }

    componentWillUnmount = () => {
        console.log('ChannelBoard Unmount');
        if (this.props.sendbird.isAdmin){
            this.sb.disconnect(() => {
                console.log('disconnected');
                this.props.sbDisconnect();
            })
        }else{
            //Leave general channel to avoid matching again
            this.sb.openChannelExit(this.props.sendbird.generalChannel, (response, error) => {
                if (error) {
                    console.error(error);
                    return;
                }

                console.log("response:", response);

                //Leave all the group channel

                this.props.sendbird.channels.map((channel, index) => {
                    console.log("channel: ",channel);

                    this.sb.groupChannelLeave(channel, (response, error) => {
                        if (error) {
                            console.error(error);
                            return;
                        }

                        console.log("response:", response);

                        this.sb.disconnect(() => {
                            console.log('disconnected');
                            this.props.sbDisconnect();
                        })
                    })

                    return null;
                });
            });
        }

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
    };

    addChannelToList = (channel) => {

    }

    onMessageReceived = (channel, message) => {
        let id = this.props.sendbird.channels.findIndex((chan) => {
            console.log(channel.url, chan.url);
            return channel.url === chan.url;
        });
        let channelStates = this.props.sendbird.channelStates;
        channelStates[id].messages.push(message._sender.userId + ': ' + message.message);
        
        this.props.sbSetChanStates(channelStates);
    };

    onUserJoined = (channel, user) => {
        console.log("user joined: ", user.userId);
        let users = this.props.sendbird.users;
        users.push(user)
    };

    onUserLeft = (channel, user) => {
        console.log("user left: ", user.userId);

        if (this.props.sendbird.isAdmin){
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
    
            })
        }
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

    render() {
        console.log("props", this.props);

        let className =  this.props.window.loaded ? FADE_IN : FADE_OUT; 

        let content = null;

        if (this.props.sendbird.connected){
            if (this.props.sendbird.isAdmin){
                content = <AdminChatApp sb={this.sb} onInputKeyDown={this.onInputKeyDown}/> ;
            } else{
                content = <CustomerChatApp onInputKeyDown={this.onInputKeyDown}/>;
            }
        }else{
            content= <p>Wait for connecting....</p>;
        }

        return (
            <div className={className} style={{
                display: this.props.window.loaded ? 'block' : 'none'
            }}>
                <BoardTop isAdmin={this.props.sendbird.isAdmin} 
                        title={"React Chat"} 
                        handleHide={this.props.hideWindow} 
                        handleDisconnect={this.props.sendbird.isAdmin? 
                                            null
                                            :
                                            this.props.disconnectUser
                }/>
                {content}
            </div>
        );
    };
}

const mapStateToProps = ({ user, window, sendbird }) => ({
    user, window, sendbird
});

const mapDispatchToProps =(dispatch) => {
    return {
        sbConnect: (isAdmin, generalChannel, channels, channelStates) => {
            dispatch(sendbirdActions.sbConnectAction({
                isAdmin:isAdmin,
                generalChannel:generalChannel,
                channels: channels, 
                channelStates: channelStates
            }));
        },
        sbDisconnect: () => {
            console.log("sbDisconnect"); 
            dispatch(sendbirdActions.sbDisconnectAction());
        },
        sbSetGeneralChan: (generalChannel)=>{
            dispatch(sendbirdActions.sbSetGeneralChanAction({generalChannel:generalChannel}));
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
        disconnectUser: () => {
            dispatch(userActions.userDisconnectAction());            
        },
        hideWindow: () => {
            dispatch(windowActions.windowUnloadAction());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChannelBoard);
