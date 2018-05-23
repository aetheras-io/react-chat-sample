import React from 'react';
import BoxTop from './boxtop';
import ChatBox from './chatbox';

const ChatBoard = props => {
    const { isAdmin, name, onCloseClick, onHideChatBox } = props;
    return (
        <div className={isAdmin ? 'chat-board' : ''}>
            <BoxTop isAdmin= {isAdmin} name={name} handleLeave={onCloseClick} handleClose={onHideChatBox} />
            <ChatBox {...props} />
        </div >
    )
}

export default ChatBoard;
