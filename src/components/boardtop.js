import React from 'react';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

const BoardTop = props => {
    const {login, handleDisconnect, handleHide} = props;

    return (
        <div className='board-top'>
            <Grid
                container
                alignItems='center'
            >
                <Grid item xs>
                    <div className='title'>
                        React Chat
                    </div>
                </Grid>

                {login ?
                    (
                        <Grid item xs={1}>
                            <IconButton onClick={handleDisconnect}>
                                <Icon>block</Icon>
                            </IconButton>
                        </Grid>
                    ) :
                    null
                }

                <Grid item xs={1}>
                    <IconButton onClick={handleHide}>
                        <Icon>keyboard_arrow_down</Icon>
                    </IconButton>
                </Grid>

            </Grid>
        </div>
    );
};

export default BoardTop;