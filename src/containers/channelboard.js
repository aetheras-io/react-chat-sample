import React, { Component } from 'react';
import ConnectUserForm from '../components/connectUserForm';
import { connect } from 'react-redux';
import * as userActions from '../redux/modules/user';
import ChatApp from './chat';
import { withFormik } from 'formik';

class ChannelBoard extends Component {
    constructor(props) {
        super(props);

        this.state={

        };
    };

    render() {
        const {sb, display, handleHide, connectUser, disconnectUser} = this.props;
        console.log("props", this.props);

        return (
            <div className="channel-board" style={{
                display: display
            }}>
                <div className='board-top'>
                    <div className='title'>
                        React Chat
                    </div>
                    {this.props.user.login ?
                        <button onClick={disconnectUser}>Disconnect User</button> :
                        null
                    }
                    <button onClick={handleHide}>Hide</button>
                </div>

                {this.props.user.login ?
                    <ChatApp userId={this.props.user.userId} nickName={this.props.user.nickName} isAdmin={this.props.user.isAdmin} sb={sb} /> :
                    null
                }
                <ConnectUserFormContainer display={this.props.user.login ? 'none' : 'block'} handleSubmit={connectUser}/> 

            </div>
        );
    };
}

const ConnectUserFormContainer = withFormik({
    mapPropsToValues: (props) => {
        return {
            userId: '',
            nickName: '',
        };
    },
    handleSubmit: (values, formikbag) => {
        /* setValues, setStatus, and other goodies */
        const { props, setSubmitting } = formikbag;
        const { handleSubmit } = props;
        const { userId, nickName } = values;

        handleSubmit(userId, nickName);

        setSubmitting(false);
    },
    displayName: 'ConnectUserFormContainer', // helps with React DevTools
})(ConnectUserForm);

const mapStateToProps = ({ user, window }) => ({
    user, window,
})

const mapDispatchToProps = (dispatch) => {

    return {
        test: () => {
            console.log("hello");
            dispatch({ type: 'some action' });
        },

        connectUser: (userId, nickName) => {
            console.log("connectUser");
            dispatch(userActions.userConnectAction({
                userId: userId,
                nickName: nickName
            }));
        },

        disconnectUser: () => {
            console.log("disconnectUser");
            dispatch(userActions.userDisconnectAction())
        }
    }

}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChannelBoard);
