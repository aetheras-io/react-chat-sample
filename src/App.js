import React, { Component } from 'react';
import { connect } from 'react-redux';
// import * as windowActions from './redux/modules/window';
import ChatAPI from './utils/chatapi';
import './App.css';
import ChannelBoard from './containers/channelboard';

const sb = new ChatAPI('FDA75C2D-F0F0-43A6-A5A8-B7CCC998AE17');

class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            show: false,
        };
    }

    handleClick = ()=>{
        if (this.props.user.login){
            this.setState({
                show:true,
            });
        }
    }

    handleHide = () => {
        console.log("handleHide");

        this.setState({
            show:false,
        });
    }

    render() {
        console.log("state:", this.state);

        let transition = "";

        if (this.state.show){
            transition = " sb-fade-out";
        }else{
            transition = " sb-fade-in";
        }

        return (
            <div id="sb_widget" >
                {this.props.user.login ?<ChannelBoard display={this.state.show ? 'block' : 'none'} sb={sb} userId={this.props.user.userId} nickName={this.props.user.nickName} handleHide={this.handleHide}/> :
                null
                }
                <div className={ 'widget ic-connected' + transition } onClick={this.handleClick} style={{
                    display: this.state.show ? 'none' : 'block'
                }}>
                </div>
            </div>   
        );
    }
}

const mapStateToProps = ({ user }) => ({
    user,
})


export default connect(
    mapStateToProps
)(App)
