import React from 'react';

const ChannelList = props => {
    const {data, onClick} = props;

    const tasks = data.map((task, index) => {
        return (
            <li
                key={'channelItem_' + index}
                onClick={e => { onClick(e, index) }}>
               
                <div style={{
                    cursor: 'pointer'
                }}>
                    {task.name}
                    <i className="material-icons" style={{
                        marginLeft: 10
                    }}>
                        open_in_browser
                    </i>
                </div>
            </li >
        );
    });

    return (
        <div className='channel-list'>
            <ul>
                {tasks}
            </ul>
        </div>
    );
};

export default ChannelList;