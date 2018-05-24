import React, { Component } from 'react';
import BoxTop from './boxtop';

class ChatBox extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        const { sb , channel, channelState } = this.props;
        this.sb = sb

        this.state = {
            channel: channel,
            channelState : channelState,
        };
    };

    onInputKeyDown = (event) => {
        const {id, submitChannelState, onError} = this.props;

        //const id = event.target.id;
        let cState = this.state.channelState;

        if (event.key === 'Enter') {
            cState.submitting = true;
    
            this.setState({
                channelState: cState
            });
    
            this.sb.sendTextMessage(this.state.channel, this.state.channelState.newMessage, (message, error) => {
                cState = this.state.channelState;
                cState.submitting = false;

                if (error) {
                    this.setState({
                        channelState: cState
                    });
    
                    console.error(error);
                    onError(error);
                    return;
                }
    
                cState.newMessage = "";
                cState.messages.push('me: ' + message.message);
    
                submitChannelState(id, cState);
            });
        }
    }

    onMessageChange = (event) => {
        let cState = this.state.channelState;
        cState.newMessage = event.target.value;

        this.setState({
            channelState: cState
        });
    }

    render() {
        const { id , isAdmin, name, onCloseClick, onHideChatBox } = this.props;
        console.log("Chatbox[", id, "] rendering!");
        console.log("props: ", this.props);

        const messageList = this.state.channelState.messages.map((message, index) => <ul key={index} className="messages">{message}</ul>);
        return (
            <div className={isAdmin ? 'chat-board' : ''}>
                <BoxTop isAdmin= {isAdmin} name={name} handleLeave={onCloseClick} handleClose={onHideChatBox} />
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
                        value={this.state.channelState.newMessage}
                        disabled={this.state.channelState.submitting}
                        onKeyPress={this.onInputKeyDown}
                        onChange={this.onMessageChange}
                        style={{ display: 'inline-block' }}
                        placeholder='Type-in your message'
                    />
                    {this.state.channelState.submitting ? <p style={{ display: 'inline-block' }}> submitting...</p> : null}
                </div>
            </div>
        );
    };
} 

export default ChatBox;
