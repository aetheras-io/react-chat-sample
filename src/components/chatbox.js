import React from 'react';

const ChatBox = props => {
    const { id, messages, newMessage, submitting, onInputKeydown, onClosed } = props;
    const messageList = messages.map((message, index) => <ul key={index} className="messages">{message}</ul>);
    return (
        <div>
            <h3>Messages</h3>
            {messageList}

            <input
                autoFocus
                type="text"
                name="message"
                id={id}
                value={newMessage}
                disabled={submitting}
                onKeyPress={onInputKeydown}
                style={{ display: 'inline-block' }}
            />
            {submitting ? <p style={{ display: 'inline-block' }}> submitting...</p> : null}

            <br /> <br />
            <button onClick={onClosed}>Log out</button>
        </div >
    )
}

export default ChatBox;
