import React, { Component } from 'react';
import BoardTop from '../components/boardtop';
import AdminChatApp from './adminchat';
import CustomerChatApp from './customerchat';
// import { withFormik } from 'formik';

class ChannelBoard extends Component {
    constructor(props) {
        super(props);

        const {sb} = this.props;
        this.sb = sb;

        this.state={

        };

        this.init();
    };

    init = () => {
        console.log('init');
        const {userId, nickName} = this.props;

        this.sb.connect(userId, nickName, () => {
            //this.setState({ connected: true });

            //find and join general channel
            this.sb.getOpenChannelInfo("general",(generalChannel) => {
                console.log("generalChannel: ", generalChannel);

                this.setState({ generalChannel: generalChannel });

                let callback = (response, error) => {

                    console.log("response:", response);
                    if (error) {
                        console.log(error);

                        this.setState({ 
                            hasError: true, 
                            errMsg: JSON.stringify(error) 
                        });
                        return;
                    }
                    console.log('joined channel: ', generalChannel.name);

                    //check whether this user is an admin (operator of general open channel)
                    let isOperator = generalChannel.isOperatorWithUserId(userId);
                    console.log("operators:", generalChannel.operators);

                    this.setState({ 
                        connected: true,
                        isAdmin: isOperator,
                        hasError: false, 
                        errMsg:"",
                    });
                }

                generalChannel.enter(callback);
            });

        });
    }

    componentWillUnmount = () => {
        console.log('Chat Unmount');
        this.sb.disconnect(() => {
            console.log('disconnected');
        })
    };

    render() {
        const {display, userId, handleHide } = this.props;
        console.log("props", this.props);

        let transition = "";

        if (display==="none"){
            transition = " sb-fade-out";
        }

        if (display==="block"){
            transition = " sb-fade-in";
        }

        let content = null;

        if (this.state.connected){
            if (this.state.isAdmin){
                content = <AdminChatApp userId={userId} sb={this.sb} /> ;
            } else{
                content = <CustomerChatApp userId={userId} sb={this.sb} handleHide={handleHide}/>;
            }
        }else{
            content= <p>Wait for connecting....</p>;
        }

        return (
            <div className={"channel-board" + transition} style={{
                display: display
            }}>
                <BoardTop  handleHide={handleHide}/>
                {content}
            </div>
        );
    };
}

// const ConnectUserFormContainer = withFormik({
//     mapPropsToValues: (props) => {
//         return {
//             userId: '',
//             nickName: '',
//         };
//     },
//     handleSubmit: (values, formikbag) => {
//         /* setValues, setStatus, and other goodies */
//         const { props, setSubmitting } = formikbag;
//         const { handleSubmit } = props;
//         const { userId, nickName } = values;

//         handleSubmit(userId, nickName);

//         setSubmitting(false);
//     },
//     displayName: 'ConnectUserFormContainer', // helps with React DevTools
// })(ConnectUserForm);

export default ChannelBoard;
