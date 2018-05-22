import React, { Component } from 'react';
import ChatBox from '../components/chatbox';
import BoxTop from '../components/boxtop';
import { connect } from 'react-redux';
// import { ChatToken } from './mocks/api';

class CustomerChatApp extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        this.state = {
            hasError: false,
            errMsg: "",
        };
    };

    render() {
        const {onInputKeyDown} = this.props;
        console.log("state:", this.state);

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
                    <p>Waiting for your service agent...</p>
                </div>
            )
        }

        const boxes = this.props.sendbird.channels.map((chan, index) => {
            console.log("index:", index);
            
            const state = this.props.sendbird.channelStates[index];

            return ( 
                <div  key={index}>
                    <BoxTop isAdmin={this.props.sendbird.isAdmin} name={'Logged in as ' + this.props.user.userId}  />
                    <ChatBox name={chan.name} url={chan.url} id={index} onInputKeydown={onInputKeyDown} {...state} />
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

const mapStateToProps = ({ user, sendbird }) => ({
    user, sendbird
});

export default connect(
    mapStateToProps
)(CustomerChatApp);