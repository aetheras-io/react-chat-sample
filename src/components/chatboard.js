import React from 'react';
import BoxTop from './boxtop';
import ChatBox from './chatbox';

const ChatBoard = props => {
    const { isAdmin, name, onCloseClick, onHideChatBox } = props;
    return (
        <div className='chat-board'>
            <BoxTop isAdmin= {isAdmin} name={name} handleLeave={onCloseClick} handleClose={onHideChatBox} />

            {/* <h4> url: {url} </h4> */}
            <ChatBox {...props} />
            <hr />
        </div >
    )
}

export default ChatBoard;
