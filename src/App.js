import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as windowActions from './redux/modules/window';
import ChatAPI from './utils/chatapi';
import './App.css';
import ChannelBoard from './containers/channelboard';

const sb = new ChatAPI('FDA75C2D-F0F0-43A6-A5A8-B7CCC998AE17');

class App extends Component {
    constructor(props){
        super(props);

        //stateless
        this.state = {

        };
    }

    handleClick = ()=>{
        if (this.props.user.login){
            this.props.showWindow();
        }
    }

    handleHide = () => {
        console.log("handleHide");
        this.props.hideWindow();
    }

    render() {
        console.log("props:", this.props);

        let icon = null;
        let board = null;

        if (this.props.user.login && this.props.window.loaded){
            icon=  <div className={ 'widget ic-connected sb-fade-out' } onClick={this.handleClick} style={{
                display: 'none'}}></div>;

        }else{
            icon=  <div className={ 'widget ic-connected sb-fade-in' } onClick={this.handleClick} style={{
                display: 'block'}}></div>;
        }

        return (
            <div id="sb_widget" >
                {icon}
                {this.props.user.login ? <ChannelBoard display={this.props.window.loaded ?'block' : 'none'} sb={sb} userId={this.props.user.userId} nickName={this.props.user.nickName} handleHide={this.handleHide}/>:
                null}
            </div>   
        );
    }
}

const mapStateToProps = ({ window, user }) => ({
    window, user,
});

const mapDispatchToProps =(dispatch) => {
    return {
        showWindow: () => {
            dispatch(windowActions.windowLoadAction({}));
        },

        hideWindow: () => {
            dispatch(windowActions.windowUnloadAction());
        }
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
