import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import {
    MenuItem,
    Paper,
    TextField,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';


const styles = {
    root: {
        height: 250,
        flexGrow: 1,
    },
    container: {
        position: 'relative',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        marginTop: 8,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    }
};

class ClientSuggest extends Component {
    constructor(props) {
        super(props);

        console.log(`inside ClientSuggest; setting value to: ${this.props.clientProps.value}`);
        this.state = {
            value: this.props.clientProps.value,
            // Autosuggest is closed at first.
            suggestions: []
        };

        console.log('ClientSuggest props:');
        console.log(this.props);
        this.clients = this.buildClientSuggestions(this.props.suggestions);
    }

    buildClientSuggestions = clients => {
        console.log('building suggestion names: ', clients);
        console.log(clients.length);
        let names = clients.length !== 0
                    ? clients.map(client => ({name: client}))
                    : []

        console.log('built suggestions: ', names);
        return names;
    }

    // Teach Autosuggest how to calculate suggestions for any given input value.
    getSuggestions = value => {
        console.log('getting suggestions: ', this.clients);
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0
               ? []
               : this.clients.filter(client =>
            client.name.toLowerCase().slice(0, inputLength) === inputValue);
    };

    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion. Teach Autosuggest how to calculate the
    // input value for every given suggestion.
    getSuggestionValue = suggestion => suggestion.name;

    renderInputComponent = inputProps => {
        const { classes, inputRef = () => {}, ref, ...other } = inputProps;

        // Combine props from the DaySheet with the require props for the
        // autosuggest.
        const combinedInputProps = {
            ...this.props.clientProps.InputProps,
            inputRef: node => {
                ref(node);
                inputRef(node);
            }
        };
        const combinedClientProps = {...this.props.clientProps, InputProps: combinedInputProps};

        return (
            <TextField
                {...combinedClientProps}
                {...other}
            />
        );
    };

    renderSuggestionsContainer = options => (
        <Paper {...options.containerProps} square>
            {options.children}
        </Paper>
    );

    renderSuggestion = (suggestion, { query, isHighlighted }) => {
        return (
            <MenuItem selected={isHighlighted} component="div">
                {suggestion.name}
            </MenuItem>
        );
    };

    onChange = (event, { newValue }) => {
        console.log('in auto onChange');
        console.log('newValue: ', newValue);
        this.setState({
            value: newValue
        });
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { classes } = this.props;
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            classes,
            value: value,
            placeholder: "Enter a client's name",
            onChange: this.onChange,
            onBlur: this.props.onBlur
        };

        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderInputComponent={this.renderInputComponent}
                renderSuggestionsContainer={this.renderSuggestionsContainer}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
            />
        );
    }
}

export default withStyles(styles)(ClientSuggest);
