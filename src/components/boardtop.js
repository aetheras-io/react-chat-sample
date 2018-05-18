import React from 'react';

const BoardTop = props => {
    const {handleHide , handleDisconnect} = props;

    return (
        <div className='board-top'>
            <div className='title'>
                React Chat
            </div>
 
            {handleDisconnect ?
                (
                    <div style={{
                        float:'right',
                        cursor: 'pointer',
                    }} onClick={handleDisconnect}>
                        <i className="material-icons">directions_run</i>
                    </div>
                ) :
                null
            }

            {handleHide ?
                <div style={{
                            float:'right',
                            cursor: 'pointer',
                        }} onClick={handleHide}>
                    <i className="material-icons">keyboard_arrow_down</i>
                </div> 
                :
                null
            }
        </div>
    );
};

export default BoardTop;