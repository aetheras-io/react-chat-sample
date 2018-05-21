import React, { Component } from 'react';
import BoardTop from '../components/boardtop';
import AdminChatApp from './adminchat';
import CustomerChatApp from './customerchat';
import ChatAPI from '../utils/chatapi';
import { connect } from 'react-redux';
import * as sendbirdActions from '../redux/modules/sendbird';

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
        const {userId, nickName} = this.props;

        this.sb.connect(userId, nickName, () => {
            //this.setState({ connected: true });

            //find and join general channel
            this.sb.getOpenChannelInfo("general",(generalChannel) => {
                console.log("generalChannel: ", generalChannel);

                this.props.sbSetGeneralChan(generalChannel);
                // this.setState({ generalChannel: generalChannel });

                let callback = (response, error) => {

                    console.log("response:", response);
                    if (error) {
                        console.log(error);
                        
                        this.setState({ 
                            hasError: true, 
                            errMsg: JSON.stringify(error) 
                        });
                        return;
                    }
                    console.log('joined channel: ', generalChannel.name);

                    //check whether this user is an admin (operator of general open channel)
                    let isOperator = generalChannel.isOperatorWithUserId(userId);
                    console.log("operators:", generalChannel.operators);

                    //redux
                    this.props.sbConnect();
                    this.props.sbSetAdmin(isOperator);

                    // this.setState({ 
                    //     connected: true,
                    //     isAdmin: isOperator,
                    //     hasError: false, 
                    //     errMsg:"",
                    // });
                }

                generalChannel.enter(callback);
            });

        });
    }

    // componentWillUnmount = () => {
    //     console.log('ChannelBoard Unmount');
    //     this.sb.disconnect(() => {
    //         console.log('disconnected');
    //     })
    // };

    render() {
        const {display, userId, handleHide, handleDisconnect } = this.props;
        console.log("props", this.props);

        let transition = "";

        if (display==="none"){
            transition = " sb-fade-out";
        }

        if (display==="block"){
            transition = " sb-fade-in";
        }

        let content = null;

        if (this.props.sendbird.connected){
            if (this.props.sendbird.isAdmin){
                content = <AdminChatApp userId={userId} sb={this.sb} /> ;
            } else{
                content = <CustomerChatApp userId={userId} sb={this.sb} handleHide={handleHide}/>;
            }
        }else{
            content= <p>Wait for connecting....</p>;
        }

        return (
            <div className={"channel-board" + transition} style={{
                display: display
            }}>
                <BoardTop handleHide={handleHide} handleDisconnect={this.props.sendbird.isAdmin? 
                                                                        null
                                                                        :
                                                                        handleDisconnect
                                                                    }/>
                {content}
            </div>
        );
    };
}

const mapStateToProps = ({ sendbird }) => ({
    sendbird
});

const mapDispatchToProps =(dispatch) => {
    return {
        sbConnect: () => {
            dispatch(sendbirdActions.sbConnectAction({}));
        },
        sbSetAdmin: (isAdmin)=> {
            dispatch(sendbirdActions.sbSetAdminAction({isAdmin:isAdmin}));
        },
        sbSetGeneralChan: (generalChannel)=>{
            dispatch(sendbirdActions.sbSetGeneralChanAction({generalChannel:generalChannel}));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChannelBoard);
