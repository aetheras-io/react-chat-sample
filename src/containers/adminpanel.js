import React, { Component } from 'react';
import UserProfile from '../components/userprofile';


class AdminPanel extends Component {
    constructor(props) {
        super(props);
        const { sb, generalChannel } = this.props;
        this.sb = sb
        this.generalChannel = generalChannel

        this.state = {
            users: []
        };
    };

    componentWillMount = () => {
        this.sb.getUsersInChannel(this.generalChannel, (list) => {
            let filter = list.filter(u => {
                return u.userId !== this.state.userId;
            })

            this.setState({ users: filter })
        });
    }

    render() {

        const profiles = this.state.users.map((user, index) => {
            console.log("index:", index)
            return <UserProfile userId={user.userId} nickName={user.nickname} connectStatus={user.connectionStatus} lastSeenAt={user.lastSeenAt} />
        });

        return (
            <div>
                User Profiles
                {profiles}
            </div>);
    };
}

export default AdminPanel;