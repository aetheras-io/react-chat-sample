import React from 'react';
import BoxTop from './boxtop';

const ChatBox = props => {
    const { name, id, url, messages, newMessage, submitting, onInputKeydown, onCloseClick, onHideChatBox } = props;
    const messageList = messages.map((message, index) => <ul key={index} className="messages">{message}</ul>);
    return (
        <div className='chat-board'>
            <BoxTop name={name} handleLeave={onCloseClick} handleClose={onHideChatBox} />

            {/* <h4> url: {url} </h4> */}

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
                    onKeyPress={onInputKeydown}
                    style={{ display: 'inline-block' }}
                    placeholder='Type-in your message'
                />
                {submitting ? <p style={{ display: 'inline-block' }}> submitting...</p> : null}
            </div>
            <hr />
        </div >
    )
}

export default ChatBox;
