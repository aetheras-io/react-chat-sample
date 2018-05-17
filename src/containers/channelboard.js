import React, { Component } from 'react';
import BoardTop from '../components/boardtop';
import { connect } from 'react-redux';
import AdminChatApp from './adminapp';
// import { withFormik } from 'formik';

class ChannelBoard extends Component {
    constructor(props) {
        super(props);

        this.state={

        };

        this.init();
    };

    init = () => {
        console.log('init');
        const {sb, userId, nickName} = this.props;

        sb.connect(userId, nickName, () => {
            this.setState({ connected: true });

            //find and join general channel
            sb.getOpenChannelInfo("general",(generalChannel) => {
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
                        isAdmin: isOperator,
                        hasError: false, 
                        errMsg:"",
                    });
                }

                generalChannel.enter(callback);
            });

        });
    }

    render() {
        const {sb, display, handleHide } = this.props;
        console.log("props", this.props);

        let transition = "";

        if (display==="none"){
            transition = " sb-fade-out";
        }

        if (display==="block"){
            transition = " sb-fade-in";
        }

        let content = null;

        if (this.state.isAdmin){
            content = <AdminChatApp isAdmin={this.state.isAdmin} sb={sb} /> ;
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

const mapStateToProps = ({  window }) => ({
    window,
})


export default connect(
    mapStateToProps
)(ChannelBoard);
