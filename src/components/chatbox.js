import React from 'react';

const ChatBox = props => {
    const { name, id, messages, newMessage, submitting, onInputKeydown} = props;
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
                onKeyPress={onInputKeydown}
                style={{ display: 'inline-block' }}
                placeholder='Type-in your message'
            />
            {submitting ? <p style={{ display: 'inline-block' }}> submitting...</p> : null}
        </div>
    )
}

export default ChatBox;
