import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as sendbirdActions from '../redux/modules/sendbird';

class ChatBox extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        const { sb } = this.props;
        this.sb = sb

        this.state = {
        };
    };

    onInputKeyDown = (event) => {
        console.log("onInputKeyDown");
        const id = event.target.id;
        let channelStates = this.props.sendbird.channelStates;
    
        if (event.key === 'Enter') {
            channelStates[id].submitting = true;
    
            this.props.sbSetChanStates(channelStates);
    
            let channel = this.props.sendbird.channels[id];
            this.sb.sendTextMessage(channel, channelStates[id].newMessage, (message, error) => {
                if (error) {
                    channelStates[id].submitting = false;
    
                    this.props.sbSetChanStates(channelStates);
    
                    console.error(error);
                    return;
                }
    
                channelStates[id].submitting = false;
                channelStates[id].newMessage = "";
                channelStates[id].messages.push('me: ' + message.message);
    
                this.props.sbSetChanStates(channelStates);
            });
        } else {
            channelStates[id].newMessage = channelStates[id].newMessage + event.key;
    
            this.props.sbSetChanStates(channelStates);
        }
    };

    render() {
        const { id, messages, newMessage, submitting} = this.props;
        console.log("props: ", this.props);

        const messageList = messages.map((message, index) => <ul key={index} className="messages">{message}</ul>);
        return (
            <div className='content'>
                <div className='message-content'>
                    <div className='message-list'>
                        {messageList}
                    </div>
                </div>
                <input
                    className="input"
                    autoFocus
                    type="text"
                    name="message"
                    id={id}
                    value={newMessage}
                    disabled={submitting}
                    onKeyPress={this.onInputKeyDown}
                    style={{ display: 'inline-block' }}
                    placeholder='Type-in your message'
                />
                {submitting ? <p style={{ display: 'inline-block' }}> submitting...</p> : null}
            </div>
        );
    };
} 


const mapStateToProps = ({ sendbird }) => ({
    sendbird
});

const mapDispatchToProps =(dispatch) => {
    return {
        sbSetChanStates: (channelStates) => {
            console.log("sbSetChanStates");
            dispatch(sendbirdActions.sbSetChanStatesAction({channelStates}));
        },

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatBox);
