import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatApp from './containers/chat';

class App extends Component {
    render() {
        return (
            this.props.window.loaded ?
                <ChatApp userId={this.props.window.userId} nickName={this.props.window.nickName} isAdmin={this.props.window.isAdmin} chatId={'5DAF0672-DF3A-4025-B813-29E7492E5260'} /> :
                null
        );
    }
}

const mapStateToProps = ({ window }) => ({
    window,
})


export default connect(
    mapStateToProps
)(App)
