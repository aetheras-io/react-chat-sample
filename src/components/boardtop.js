import React from 'react';

const BoardTop = props => {
    const {isAdmin, title,  handleHide , handleDisconnect} = props;

    let titleText = title ? title : "React Chat";

    return (
        <div className='board-top'>
            <div className='title'>
                {titleText}
            </div>
 
            {!isAdmin ?
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