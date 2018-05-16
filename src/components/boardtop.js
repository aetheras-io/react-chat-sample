import React from 'react';

const BoardTop = props => {
    const {login, handleDisconnect, handleHide} = props;

    return (
        <div className='board-top'>
            <div className='title'>
                React Chat
            </div>
            {login ?
                <button onClick={handleDisconnect}>Disconnect User</button> :
                null
            }
            <button onClick={handleHide}>Hide</button>
        </div>
    );
};

export default BoardTop;