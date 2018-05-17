import React from 'react';

const BoardTop = props => {
    const {handleHide} = props;

    return (
        <div className='board-top'>
            <div className='title'>
                React Chat
            </div>
 
            {/* {login ?
                (
                    <div style={{
                        float:'right',
                        cursor: 'pointer',
                    }} onClick={handleDisconnect}>
                        <i className="material-icons">block</i>
                    </div>
                ) :
                null
            } */}

            <div style={{
                        float:'right',
                        cursor: 'pointer',
                    }} onClick={handleHide}>
                <i className="material-icons">keyboard_arrow_down</i>
            </div>

        </div>
    );
};

export default BoardTop;