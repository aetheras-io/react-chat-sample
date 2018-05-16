import React from 'react';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

const ChannelList = props => {
    const {data, onClick} = props;

    const tasks = data.map((task, index) => {
        return (
            <li
                key={'channelItem_' + index}
                onClick={e => { onClick(e, index) }}>
               
                <div >
                    <Button>
                        {task.name}
                        <Icon style={{
                            marginLeft: 10
                        }}>open_in_browser</Icon>
                    </Button>
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