import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatApp from './containers/chat';
// import * as windowActions from './redux/modules/window';
import ChatAPI from './utils/chatapi';

class App extends Component {
    render() {
        let sb = new ChatAPI('FDA75C2D-F0F0-43A6-A5A8-B7CCC998AE17');
        // let sb = new ChatAPI('11D3F84B-6C8E-4F39-B96B-9743C7820C53');
        return (
            this.props.window.loaded ?
                //<ChatApp userId={this.props.window.userId} nickName={this.props.window.nickName} isAdmin={this.props.window.isAdmin} chatId={'5DAF0672-DF3A-4025-B813-29E7492E5260'} /> :
                <ChatApp userId={this.props.window.userId} nickName={this.props.window.nickName} isAdmin={this.props.window.isAdmin} sb={sb} /> :
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
