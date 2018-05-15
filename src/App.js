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
        this.setState({
            show:true,
        });
    }

    handleHide = () => {
        console.log("handleHide");

        this.setState({
            show:false,
        });
    }

    render() {
        console.log("state:", this.state);

        //  {this.props.window.loaded ?
        //     <ConnectUserFormContainer sb={sb} /> :
        //     null } 

        return (
            <div id="sb_widget" >
                <ChannelBoard display={this.state.show ? 'block' : 'none'} sb={sb} handleHide={this.handleHide}/> 
                <div onClick={this.handleClick} style={{
                    display: this.state.show ? 'none' : 'block'
                }}>
                    Click to open
                </div>
            </div>   
        );
    }
}

export default App;

// const mapStateToProps = ({ window }) => ({
//     window,
// })


// export default connect(
//     mapStateToProps
// )(App)
