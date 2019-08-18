import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import CustomTheme from './theme.json'
import PageHeader from './components/page_header'
import DaySheet from './pages/day_sheet'


const theme = createMuiTheme(CustomTheme);

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <PageHeader />
                <DaySheet clients={this.props.clients} />
            </ThemeProvider>
        );
    }
}

export default App;
