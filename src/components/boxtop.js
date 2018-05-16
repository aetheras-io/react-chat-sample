import React from 'react';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

const BoxTop = props => {
    const {name, handleLeave, handleClose} = props;

    return (
        <div className='top'>
            <Grid
                container
                alignItems='center'
            >
                <Grid item xs>
                    <div className='title'>
                        {name}
                    </div>
                </Grid>

    
                <Grid item xs={1}>
                    <IconButton onClick={handleLeave}>
                        <Icon>directions_run</Icon>
                    </IconButton>
                </Grid>
  

                <Grid item xs={1}>
                    <IconButton onClick={handleClose}>
                        <Icon>clear</Icon>
                    </IconButton>
                </Grid>

            </Grid>
        </div>
    );
};

export default BoxTop;