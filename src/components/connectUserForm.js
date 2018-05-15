import React from 'react';

const ConnectUserForm = props => {
    const {display, 
        values,        
        handleChange,
        handleBlur,
        handleSubmit,
    } = props;

    return (
        <div id="content.login-form" style={{
            display: display
        }}>
            <form onSubmit={handleSubmit}>
                <div className="user-id">
                    UserID:<br/>
                    <input
                        name="userId"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.userId}
                        placeholder='Type-in user id...'
                    />
                </div>
                <div className="nickname">
                    NickName:<br/>
                    <input
                        name="nickName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.nickName}
                        placeholder='Type-in user nickname...'
                    />
                </div>
                <div>
                    <input type="submit" id="connectBtn" value="Connect User"/>
                </div>
            </form>
        </div>
    );
}

export default ConnectUserForm;