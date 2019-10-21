import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import CustomTheme from './theme.json';
import PageHeader from './components/page_header';
import DaySheet from './pages/day_sheet';


const theme = createMuiTheme(CustomTheme);

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clientIndex: {},
            // TODO: May be used in the future for loading templates.
            //       Will add a template name to be used as a `key` then we can
            //       remove `getDerivedStateFromProps`.
            clients: {}
        };
    }

    componentDidMount = () => {
        this.loadClients();
    }

    loadClients = () => {
        fetch('http://localhost:8085/pay/clients')
        .then(response => response.json())
        .then(clients => {
            console.log('clients loaded:');
            console.log(clients);

            this.setState(
                {clientIndex: {...clients}},
                () => console.log('index initialized:', this.state.clientIndex)
            );
        })
        .catch(error => console.error(error));
    }

    updateClientIndex = (clients) => {
        console.log('current Client Index: ', this.state.clientIndex);
        console.log('clients to add to index: ', clients);

        // Persist the clients.
        fetch('http://localhost:8085/pay/daysheet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(clients)
        })
        .then(response => response.json())
        .then(result => {
            console.log('index saved.');

            this.setState(
                (prevState) => ({
                    clientIndex: {...prevState.clientIndex, ...clients}
                }),
                () => console.log('index updated:', this.state.clientIndex)
            );
        })
        .catch(error => console.error(error));
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <PageHeader />
                <DaySheet clientIndex={this.state.clientIndex}
                          clients={this.state.clients}
                          onSubmit={this.updateClientIndex} />
            </ThemeProvider>
        );
    }
}

export default App;
