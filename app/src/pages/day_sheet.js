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
import clonedeep from 'lodash.clonedeep';

import ClientSuggest from '../components/autosuggest';


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
        paid: '$',
        comments: ''
    }
};

class DaySheet extends Component {
    constructor(props) {
        super(props);
        console.log('DaySheet props:');
        console.log(props);

        this.state = {
            clients: {
                ...this.props.clients,
                new: {
                    name: '',
                    dx_code: 'F',
                    cpt_code: '',
                    insurance: 'BCBS',
                    paid: '$',
                    comments: ''
                }
            }
        };
        console.log('set DaySheet state: ', this.state);

        this.addClient = this.addClient.bind(this);
        this.deleteClient = this.deleteClient.bind(this);
        this.buildRow = this.buildRow.bind(this);

        this.handleInput = this.handleInput.bind(this);
        this.handleNameBlur = this.handleNameBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    addClient(e) {
        console.log('adding client row...');
        this.setState(
            (prevState) => ({
                clients: {
                    ...prevState.clients,
                    new: {
                        name: '',
                        dx_code: 'F',
                        cpt_code: '',
                        insurance: 'BCBS',
                        paid: '$',
                        comments: ''
                    }
                }
            }),
            () => console.log('added row.', this.state)
        );
    }

    deleteClient(e) {
        console.log('deleting client row...');
        let { key, field } = this._parseKeyAndField(e.currentTarget.name);
        this.setState(
            (prevState) => {
                let state = clonedeep(prevState.clients);
                delete state[key];
                return {clients: state};
            },
            () => console.log('deleted row.', this.state)
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
        console.log('in handleInput');
        let value = e.target.value;
        let clients = clonedeep(this.state.clients)
        let { key, field } = this._parseKeyAndField(e.target.name);

        console.log(`updating state with key: ${key}
                    field: ${field}
                    value: ${value}`);
        clients[key][field] = value

        this.setState(
            {clients}, () => console.log(this.state)
        )
    }

    handleNameBlur(e) {
        console.log('in handleNameBlur');
        let value = e.target.value;
        let clients = clonedeep(this.state.clients)
        let { key, field } = this._parseKeyAndField(e.target.name);
        console.log(`value: ${value}`);
        console.log('current state: ', this.state);

        // This section updates the index key value if there is a change while
        // preserving the client data.  We'll then update the name field with
        // the key value.
        if (value != key) {
            const index = this.props.clientIndex;
            const clientCopy = index.hasOwnProperty(value)
                               ? clonedeep(index[value])
                               : clonedeep(clients[key]);
            console.log('copy:');
            console.log(clientCopy);
            console.log(`deleting: ${key}`);
            delete clients[key];
            console.log(`updating key to '${value}' for client copy.`);
            clients[value] = clientCopy;

            clients[value][field] = value
            console.log('updated name.');
            this.setState(
                {clients: clients},
                () => console.log('handled blur.', this.state)
            );
        }
    }

    handleSubmit(e) {
        console.log('in handleSubmit');
        // const fs = require('fs')

        // fs.writeFile('/Users/flavio/test.txt', content, (err) => {
        //   if (err) {
        //     console.error(err)
        //     return
        //   }
        //   //file written successfully
        // })
        this.props.onSubmit(this.state.clients);
        alert('Will upload to Google and e-mail Kristin.');
        this.setState({
            clients: {
                new: {
                    name: '',
                    dx_code: 'F',
                    cpt_code: '',
                    insurance: 'BCBS',
                    paid: '$',
                    comments: ''
                }
            }
        });
    }

    buildRow(client) {
        console.log('building row...');
        const [ key, data ] = client;
        const { classes, clientIndex } = this.props;
        console.log('deconstructed clientIndex: ', clientIndex);
        const clientNameTextFieldProps = {
            margin: 'normal',
            name: `name-${key}`,
            value: data.name,
            placeholder: "Enter a client's name",
            InputProps: {
                classes: {
                    underline: classes.underline
                }
            }
        };

        return (
            <TableRow key={key} color="secondary">
                <TableCell component="th" scope="row">
                    <ClientSuggest suggestions={Object.keys(clientIndex)}
                                   clientProps={clientNameTextFieldProps}
                                   onBlur={this.handleNameBlur} />
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
        const { clients } = this.state;
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
