import React from 'react';

const BoxTop = props => {
    const {isAdmin, name, handleLeave, handleClose} = props;

    return (
        <div className='top'>

            <div className='title'>
                {name}
            </div>

            {isAdmin ?
                <div style={{
                    float:'right',
                        cursor: 'pointer',
                    }} onClick={handleLeave}>
                    <i className="material-icons">clear</i>
                </div>
            :null }

            {isAdmin ?
                <div style={{
                            float:'right',
                            cursor: 'pointer',
                        }} onClick={handleClose}>
                    <i className="material-icons">keyboard_arrow_down</i>
                </div>
            :null }

        </div>
    );
};

export default BoxTop;