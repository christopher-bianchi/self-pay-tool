import React, { Component } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    TextField,
    Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';


const styles = {
    input: {
        width: '250px'
    }
};

class PageHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        const formattedDate = Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: '2-digit',
            year: 'numeric'
        }).format(new Date());

        return (
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Box width="25%">
                        <Typography variant="h5" color="inherit">
                            Ranya Bianchi, LMHC
                        </Typography>
                    </Box>
                    <Box width="75%" display="flex" justifyContent="flex-end">
                        <TextField
                             id="date"
                             defaultValue={formattedDate}
                             className={classes.input}
                             margin="dense"
                             variant="outlined"
                         />
                    </Box>
                </Toolbar>
            </AppBar>
        );
    }
}

// PageHeader.propTypes = {
//   classes: PropTypes.object.isRequired
// };

export default withStyles(styles)(PageHeader);
