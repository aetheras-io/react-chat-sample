import React, { Component } from 'react';
import ChatBoard from '../components/chatboard';
import { connect } from 'react-redux';
// import { ChatToken } from './mocks/api';

class CustomerChatApp extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        this.state = {};
    };

    render() {
        const {sb} = this.props;
        console.log("state:", this.state);

        if (this.props.sendbird.channels.length === 0) {
            return (
                <div>
                    <p>Waiting for your service agent...</p>
                </div>
            )
        }

        const boxes = this.props.sendbird.channels.map((chan, index) => {
            console.log("index:", index);
            
            const state = this.props.sendbird.channelStates[index];

            return ( 
                <ChatBoard sb={sb} key={index} id={index} isAdmin={this.props.sendbird.isAdmin} name={'Logged in as ' + this.props.user.userId} {...state}/>
            );
        });

        return (
            <div>
                <div className='chat-section' style={{
                    width: '100%',
                    right: '0'
                }}>
                    {boxes}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ user, sendbird }) => ({
    user, sendbird
});

export default connect(
    mapStateToProps
)(CustomerChatApp);