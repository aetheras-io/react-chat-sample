import React, { Component } from 'react';


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
        return (
            <div>
                AdminPanel
        </div>);
    };
}

export default AdminPanel;