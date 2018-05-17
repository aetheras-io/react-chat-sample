import React from 'react';

const BoxTop = props => {
    const {name, handleLeave, handleClose} = props;

    return (
        <div className='top'>

            <div className='title'>
                {name}
            </div>

    
            <div style={{
                        float:'right',
                        cursor: 'pointer',
                    }} onClick={handleLeave}>
                <i className="material-icons">directions_run</i>
            </div>

  
            <div style={{
                        float:'right',
                        cursor: 'pointer',
                    }} onClick={handleClose}>
                <i className="material-icons">clear</i>
            </div>

        </div>
    );
};

export default BoxTop;