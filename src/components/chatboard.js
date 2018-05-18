import React from 'react';
import BoxTop from './boxtop';
import ChatBox from './chatbox';

const ChatBoard = props => {
    const { name, id, messages, newMessage, submitting, onInputKeydown, onCloseClick, onHideChatBox } = props;
    const messageList = messages.map((message, index) => <ul key={index} className="messages">{message}</ul>);
    return (
        <div className='chat-board'>
            <BoxTop name={name} handleLeave={onCloseClick} handleClose={onHideChatBox} />

            {/* <h4> url: {url} </h4> */}
            <ChatBox {...props} />
            <hr />
        </div >
    )
}

export default ChatBoard;
