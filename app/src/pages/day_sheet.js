import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    FormControl,
    Grid,
    Icon,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import deepcopy from 'deepcopy';


const styles = {
    select: {
        width: 160,
        '&:before': {borderBottom: '1px solid #fbe9e7'}
    },
    sheet: {
        margin: '8px 8px 0px 8px'
    },
    submit: {
        margin: '0px 8px 0px 0px'
    },
    tableCell: {
        verticalAlign: 'bottom'
    },
    underline: {
        '&:before': {borderBottom: '1px solid #fbe9e7'}
    }
};

const newClient = {
    new: {
        name: '',
        dx_code: 'F',
        cpt_code: '',
        insurance: 'BCBS',
        amount_paid: '$',
        comments: ''
    }
};

class DaySheet extends Component {
    constructor(props) {
        super(props);
        console.log('passed in props:');
        console.log(props);

        let clients = {...newClient}
        if (Object.getOwnPropertyNames(this.props.clients).length !== 0) {
            clients = this.props.clients;
        }

        console.log('initialized state keys:');
        console.log(clients);
        this.state = {clients}

        this.addClient = this.addClient.bind(this);
        this.deleteClient = this.deleteClient.bind(this);
        this.buildRow = this.buildRow.bind(this);
        this._parseKeyAndField = this._parseKeyAndField.bind(this);

        this.handleInput = this.handleInput.bind(this);
        this.handleNameBlur = this.handleNameBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    addClient(e) {
        console.log(e);
        console.log(e.currentTarget);
        this.setState(
            (prevState) => Object.assign(prevState.clients, newClient),
            () => console.log(this.state.clients)
        );
    }

    deleteClient(e) {
        console.log(e);
        console.log(e.currentTarget);
        let {key, field} = this._parseKeyAndField(e.currentTarget.name);
        this.setState(
            (prevState) => {
                delete prevState.clients[key];
                return prevState;
            },
            () => console.log(this.state.clients)
        );
    }

    _parseKeyAndField(nameKey) {
        let index = nameKey.lastIndexOf('-');
        let key = nameKey.slice(index + 1);
        let field = nameKey.slice(0, index);
        console.log(`key: ${key}`);
        console.log(`field: ${field}`);
        return {key: key, field: field}
    }

    handleInput(e) {
        console.log('handleInput');
        let value = e.target.value;
        let clients = {...this.state.clients}
        let {key, field} = this._parseKeyAndField(e.target.name);

        console.log(`updating state with key: ${key}
                    field: ${field}
                    value: ${value}`);
        clients[key][field] = value

        this.setState(
            {clients}, () => console.log(this.state.clients)
        )
    }

    handleNameBlur(e) {
        console.log('handleNameBlur');
        let value = e.target.value;
        let clients = {...this.state.clients}
        let {key, field} = this._parseKeyAndField(e.target.name);

        if (value != key) {
            const clientCopy = deepcopy(clients[key]);
            console.log(`copy: ${clientCopy}`);
            console.log(`deleting: ${key}`);
            delete clients[key];
            console.log(`adding new key: ${value}, with old data.`);
            clients[value] = clientCopy;
            console.log(`setting field key to: ${value}`);
            key = value;
        }
        console.log(`updating state with key: ${key}
                    field: ${field}
                    value: ${value}`);
        clients[key][field] = value

        this.setState(
            {clients}, () => console.log(this.state.clients)
        )
    }

    handleSubmit(e) {
        // e.preventDefault();
        console.log(this.state)
        alert('Will upload to Google and e-mail Kristin.')
    }

    buildRow(client) {
        const [ key, data ] = client;
        const { classes } = this.props;
        console.log('builing row; data:');
        console.log(data);

        return (
            <TableRow key={key} color="secondary">
                <TableCell component="th" scope="row">
                    <TextField
                        margin="normal"
                        name={`name-${key}`}
                        defaultValue={data.name}
                        placeholder="Enter a client's name"
                        onBlur={this.handleNameBlur}
                        InputProps={{
                            classes: {
                                underline: classes.underline
                            }
                        }}
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        margin="normal"
                        name={`dx_code-${key}`}
                        value={data.dx_code}
                        onChange={this.handleInput}
                        InputProps={{
                            classes: {
                                underline: classes.underline
                            }
                        }}
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        margin="normal"
                        name={`cpt_code-${key}`}
                        value={data.cpt_code}
                        onChange={this.handleInput}
                        InputProps={{
                            classes: {
                                underline: classes.underline
                            }
                        }}
                    />
                </TableCell>
                <TableCell>
                    <FormControl>
                        <Select
                            value={data.insurance}
                            onChange={this.handleInput}
                            inputProps={{
                                name: `insurance-${key}`
                            }}
                            className={classes.select}
                            margin="none"
                            autoWidth
                        >
                            <MenuItem value='BCBS'>BCBS</MenuItem>
                            <MenuItem value='Tufts'>Tufts</MenuItem>
                            <MenuItem value='United Healthcare'>United Healthcare</MenuItem>
                            <MenuItem value='Beacon'>Beacon</MenuItem>
                            <MenuItem value='self-pay'>self-pay</MenuItem>
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell>
                    <TextField
                        margin="normal"
                        name={`paid-${key}`}
                        value={data.paid}
                        onChange={this.handleInput}
                        InputProps={{
                            classes: {
                                underline: classes.underline
                            }
                        }}
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        margin="normal"
                        name={`comments-${key}`}
                        value={data.comments}
                        onChange={this.handleInput}
                        InputProps={{
                            classes: {
                                underline: classes.underline
                            }
                        }}
                    />
                </TableCell>
                <TableCell className={classes.tableCell} size="small" padding="none">
                    <IconButton color="secondary" aria-label="add" name={`add-${key}`} onClick={this.addClient}>
                        <AddIcon fontSize="inherit"/>
                    </IconButton>
                </TableCell>
                <TableCell className={classes.tableCell} size="small" padding="none">
                    <IconButton color="secondary" aria-label="delete" name={`delete-${key}`} onClick={this.deleteClient}>
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    }

    render() {
        const { classes } = this.props;
        let clients = this.state.clients;
        console.log('render clients:');
        console.log(clients);
        let rows = Object.entries(clients).map(this.buildRow);
        const thColor = 'secondary';

        return (
            <Fragment>
                <Paper className={classes.sheet}>
                    <form>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="h6" color={thColor}>
                                            Client Name
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6" color={thColor}>
                                            DX Code
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6" color={thColor}>
                                            CPT Code
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6" color={thColor}>
                                            Insurance Company
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6" color={thColor}>
                                            Amount Paid
                                        </Typography>
                                    </TableCell>
                                    <TableCell colSpan={3}>
                                        <Typography variant="h6" color={thColor}>
                                            Comments
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows}
                            </TableBody>
                        </Table>
                    </form>
                </Paper>
                <Grid container>
                    <Grid item xs={12} align="right">
                        <Button variant="contained" color="primary" type="submit" className={classes.submit} onClick={this.handleSubmit}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Fragment>
        );
    }
}

export default withStyles(styles)(DaySheet);
