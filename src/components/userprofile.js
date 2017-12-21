import React from 'react';

const UserProfile = props => {
    const { userId, nickName, connectStatus, lastSeenAt } = props;
    return (
        <div>
            <h3>{userId}</h3>
            <h4> nickName: {nickName} </h4>
            <h4> connectStatus: {connectStatus} </h4>
            <h4> lastSeenAt: {lastSeenAt} </h4>
            <hr />
        </div >
    )
}

export default UserProfile;
