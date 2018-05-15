import React from 'react';

const ChatBox = props => {
    const { name, id, url, messages, newMessage, submitting, onInputKeydown, onCloseClick } = props;
    const messageList = messages.map((message, index) => <ul key={index} className="messages">{message}</ul>);
    return (
        <div className='chat-board'>
            <h3>{name}</h3>
            {/* <h4> url: {url} </h4> */}
            <div className='content'>
                {messageList}
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
            />
            {submitting ? <p style={{ display: 'inline-block' }}> submitting...</p> : null}

            <br /> <br />
            <button value={id} onClick={onCloseClick}>Leave GroupChannel</button>
            <hr />
        </div >
    )
}

export default ChatBox;
