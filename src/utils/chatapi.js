import SendBird from 'sendbird';
import { xssEscape } from './utils';

const MAX_COUNT = '+9';
const GLOBAL_HANDLER = 'GLOBAL_HANDLER';
const GET_MESSAGE_LIMIT = 20;

class ChatAPI {
    constructor(appId, token) {
        this.sb = new SendBird({ appId: appId });
        this.openChannelListQuery = null;
        this.groupChannelListQuery = null;
        this.userListQuery = null;
    }

    reset() {
        this.openChannelListQuery = null;
        this.groupChannelListQuery = null;
        this.userListQuery = null;
        this.sb.removeChannelHandler(GLOBAL_HANDLER);
    }

    isConnected() {
        return !!this.sb.currentUser;
    }

    connect(userId, nickname, action) {
        this.sb.connect(userId.trim(), (user, error) => {
            if (error) {
                console.error(error);
                return;
            }
            this.sb.updateCurrentUserInfo(nickname.trim(), '', (response, error) => {
                if (error) {
                    console.error(error);
                    return;
                }
                action();
            });
        });
    }

    disconnect(action) {
        if (this.isConnected()) {
            this.sb.disconnect(() => {
                action();
            });
        }
    }

    isCurrentUser(user) {
        return this.sb.currentUser.userId === user.userId;
    }

    /*
    Channel
     */
    getOpenChannelList(action) {
        if (!this.openChannelListQuery) {
            this.openChannelListQuery = this.sb.OpenChannel.createOpenChannelListQuery();
            this.openChannelListQuery.includeEmpty = true;
            this.openChannelListQuery.limit = 20;
        }
        if (this.openChannelListQuery.hasNext && !this.openChannelListQuery.isLoading) {
            this.openChannelListQuery.next(function (channelList, error) {
                if (error) {
                    console.error(error);
                    return;
                }
                action(channelList);
            });
        }
    }

    getGroupChannelList(action) {
        if (!this.groupChannelListQuery) {
            this.groupChannelListQuery = this.sb.GroupChannel.createMyGroupChannelListQuery();
            this.groupChannelListQuery.includeEmpty = true;
            this.groupChannelListQuery.limit = 20;
        }
        if (this.groupChannelListQuery.hasNext && !this.groupChannelListQuery.isLoading) {
            this.groupChannelListQuery.next(function (channelList, error) {
                if (error) {
                    console.error(error);
                    return;
                }
                action(channelList);
            });
        }
    }

    getOpenChannelInfo(channelUrl, action) {
        this.sb.OpenChannel.getChannel(channelUrl, function (channel, error) {
            if (error) {
                console.error(error);
                return;
            }
            action(channel);
        });
    }

    getGroupChannelInfo(channelUrl, action) {
        this.sb.GroupChannel.getChannel(channelUrl, function (channel, error) {
            if (error) {
                console.error(error);
                return;
            }
            action(channel);
        });
    }

    createPrivateChannel(userIds, channelId, action) {
        var allUsers = [this.sb.currentUser.userId, ...userIds]
        console.log(allUsers);
        this.sb.GroupChannel.createChannelWithUserIds(allUsers, true, channelId, '', '', '', function (channel, error) {
            if (error) {
                console.error(error);
                return;
            }
            action(channel);
        });
    }

    getUsersInChannel = (channel, action) => {
        var participantListQuery = channel.createParticipantListQuery();
        participantListQuery.next(function (participantList, error) {
            if (error) {
                console.error(error);
                return;
            }
            action(participantList);
        });
    }

    // enterOpenChannel(channelId, action) {
    //     try {
    //         this.sb.OpenChannel.getChannel(channelId, (channel, error) => {
    //             if (error) {
    //                 console.error(error);
    //                 return;
    //             }

    //             console.log(channel);
    //             channel.enter((response, error) => {
    //                 console.log("callback!")
    //                 if (error) {
    //                     console.log(error);
    //                     return;
    //                 }
    //                 console.log(response);
    //                 console.log(error);
    //                 //console.log('sendbird joined channel: ', response.name);
    //                 // this.findPartnerAndInvite(response);
    //             });

    //         });
    //     }
    //     catch (err) {
    //         console.log(err);
    //     }

    // }

    inviteMember(channel, userIds, action) {
        channel.inviteWithUserIds(userIds, (response, error) => {
            if (error) {
                console.error(error);
                return;
            }
            action();
        });
    }

    groupChannelLeave(channel, action) {
        channel.leave((response, error) => {
            if (error) {
                console.error(error);
                return;
            }
            action();
        });
    }

    openChannelExit(channel, action) {
        channel.exit((response, error) => {
            if (error) {
                console.error(error);
                return;
            }
            action();
        });
    }

    /*
    Message
     */
    getTotalUnreadCount(action) {
        this.sb.GroupChannel.getTotalUnreadMessageCount((unreadCount) => {
            action(unreadCount);
        });
    }

    getMessageList(channelSet, action) {
        if (!channelSet.query) {
            channelSet.query = channelSet.channel.createPreviousMessageListQuery();
        }
        if (channelSet.query.hasMore && !channelSet.query.isLoading) {
            channelSet.query.load(GET_MESSAGE_LIMIT, false, function (messageList, error) {
                if (error) {
                    console.error(error);
                    return;
                }
                action(messageList);
            });
        }
    }

    sendTextMessage(channel, textMessage, action) {
        channel.sendUserMessage(textMessage, (message, error) => {
            if (error) {
                console.error(error);
                return;
            }
            action(message, error);
        });
    }

    sendFileMessage(channel, file, action) {
        let thumbSize = [{ 'maxWidth': 160, 'maxHeight': 160 }];
        channel.sendFileMessage(file, '', '', thumbSize, (message, error) => {
            if (error) {
                console.error(error);
                return;
            }
            action(message);
        });
    }

    /*
    User
     */
    getUserList(action) {
        if (!this.userListQuery) {
            this.userListQuery = this.sb.createUserListQuery();
        }
        if (this.userListQuery.hasNext && !this.userListQuery.isLoading) {
            this.userListQuery.next((userList, error) => {
                if (error) {
                    console.error(error);
                    return;
                }
                action(userList);
            });
        }
    }

    createHandler(...args) {
        let userReceivedInvitationFunc = args[0];
        let messageReceivedFunc = args[1];
        // let messageUpdatedFunc = args[2];
        let userJoinedFunc = args[2];
        let userLeftFunc = args[3];

        //console.log(userJoinedFunc);

        let channelHandler = new this.sb.ChannelHandler();
        channelHandler.onUserReceivedInvitation = userReceivedInvitationFunc;
        channelHandler.onMessageReceived = messageReceivedFunc;
        channelHandler.onUserJoined = userJoinedFunc;
        channelHandler.onUserLeft = userLeftFunc;
        // channelHandler.onMessageUpdated = messageUpdatedFunc;

        this.sb.addChannelHandler('defaulthandler', channelHandler);
    }

    /*
    Handler
     */
    createHandlerGlobal(...args) {
        let messageReceivedFunc = args[0];
        let messageUpdatedFunc = args[1];
        let messageDeletedFunc = args[2];
        let ChannelChangedFunc = args[3];
        let typingStatusFunc = args[4];
        let readReceiptFunc = args[5];
        let userLeftFunc = args[6];
        let userJoinFunc = args[7];

        let channelHandler = new this.sb.ChannelHandler();
        channelHandler.onMessageReceived = function (channel, message) {
            messageReceivedFunc(channel, message);
        };
        channelHandler.onMessageUpdated = function (channel, message) {
            messageUpdatedFunc(channel, message);
        };
        channelHandler.onMessageDeleted = function (channel, messageId) {
            messageDeletedFunc(channel, messageId);
        };
        channelHandler.onChannelChanged = function (channel) {
            ChannelChangedFunc(channel);
        };
        channelHandler.onTypingStatusUpdated = function (channel) {
            typingStatusFunc(channel);
        };
        channelHandler.onReadReceiptUpdated = function (channel) {
            readReceiptFunc(channel);
        };
        channelHandler.onUserLeft = function (channel, user) {
            userLeftFunc(channel, user);
        };
        channelHandler.onUserJoined = function (channel, user) {
            userJoinFunc(channel, user);
        };
        this.sb.addChannelHandler(GLOBAL_HANDLER, channelHandler);
    }

    /*
    Info
     */
    getNicknamesString(channel) {
        let nicknameList = [];
        let currentUserId = this.sb.currentUser.userId;
        channel.members.forEach(function (member) {
            if (member.userId !== currentUserId) {
                nicknameList.push(xssEscape(member.nickname));
            }
        });
        return nicknameList.toString();
    }

    getMemberCount(channel) {
        return (channel.memberCount > 9) ? MAX_COUNT : channel.memberCount.toString();
    }

    getLastMessage(channel) {
        if (channel.lastMessage) {
            return channel.lastMessage.isUserMessage() || channel.lastMessage.isAdminMessage()
                ? channel.lastMessage.message : channel.lastMessage.name;
        }
        return '';
    }

    getMessageTime(message) {
        const months = [
            'JAN', 'FEB', 'MAR', 'APR', 'MAY',
            'JUN', 'JUL', 'AUG', 'SEP', 'OCT',
            'NOV', 'DEC'
        ];

        var _getDay = (val) => {
            let day = parseInt(val, 10);
            if (day === 1) {
                return day + 'st';
            } else if (day === 2) {
                return day + 'en';
            } else if (day === 3) {
                return day + 'rd';
            } else {
                return day + 'th';
            }
        };

        var _checkTime = (val) => {
            return (+val < 10) ? '0' + val : val;
        };

        if (message) {
            const LAST_MESSAGE_YESTERDAY = 'YESTERDAY';
            var _nowDate = new Date();
            var _date = new Date(message.createdAt);
            if (_nowDate.getDate() - _date.getDate() === 1) {
                return LAST_MESSAGE_YESTERDAY;
            } else if (_nowDate.getFullYear() === _date.getFullYear()
                && _nowDate.getMonth() === _date.getMonth()
                && _nowDate.getDate() === _date.getDate()) {
                return _checkTime(_date.getHours()) + ':' + _checkTime(_date.getMinutes());
            } else {
                return months[_date.getMonth()] + ' ' + _getDay(_date.getDate());
            }
        }
        return '';
    }

    getMessageReadReceiptCount(channel, message) {
        return channel.getReadReceipt(message);
    }

    getChannelUnreadCount(channel) {
        return channel.unreadMessageCount;
    }

}

export { ChatAPI as default };