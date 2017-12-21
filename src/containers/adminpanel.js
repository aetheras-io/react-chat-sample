import React, { Component } from 'react';


class AdminPanel extends Component {
    constructor(props) {
        super(props);
        const { sb } = this.props;
        this.sb = sb

        this.state = {
            users: []
        };
    };

    componentWillMount = () => {
        // this.sb.getUsersInChannel(generalChannel, (list) => {
        //     let filter = list.filter(u => {
        //         return u.userId !== this.state.userId && u.connectionStatus === 'online';
        //     })

        //     this.setState({ users: filter })
        // });
    }

    render() {
        return (
            <div>
                AdminPanel
        </div>);
    };
}

export default AdminPanel;