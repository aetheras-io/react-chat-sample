import React, { Component } from 'react';
import { connect } from 'react-redux';
import {windowLoadAction} from './redux/modules/window';
import './App.css';
import ChannelBoard from './containers/channelboard';


// const WIDGET_FADE_IN = 'widget ic-connected sb-fade-in';
// const WIDGET_FADE_OUT= 'widget ic-connected sb-fade-out';

const WIDGET_FADE_IN = 'widget sb-fade-in';
const WIDGET_FADE_OUT= 'widget sb-fade-out';


class App extends Component {
    constructor(props){
        super(props);

        //stateless
        this.state = {

        };
    }

    handleClick = () => {
        if (this.props.user.login){
            this.props.showWindow();
        }
    }

    render() {
        console.log("props:", this.props);

        let icon = null;
        const mIcon = <i className='material-icons' style={{
            fontSize: '36px',
            marginLeft:'12px',
            marginTop: '12px'
        }}> chat</i>;


        if (this.props.user.login && this.props.window.loaded){
            icon=  <div className={ WIDGET_FADE_OUT } onClick={this.handleClick} style={{
                display: 'none'
            }}>
                {mIcon}
            </div>;

        }else{
            icon=  <div className={ WIDGET_FADE_IN } onClick={this.handleClick} style={{
                display: 'block'}}>
                    {mIcon}
                </div>;
        }

        return (
            <div id="sb_widget" >
                {icon}
                {this.props.user.login ? 
                    <ChannelBoard />
                    :
                    null
                }
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
            dispatch(windowLoadAction({}));
        },
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
