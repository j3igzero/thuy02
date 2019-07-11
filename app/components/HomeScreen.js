import React from 'react';
import { Actions } from 'react-native-router-flux';
import { View, TextInput } from 'react-native';
import Button from 'react-native-button';

import styles from '../styles';

export default class HomeScreen extends React.Component {
    state = {
        someone: ''
    };

    onNameChange = (someone) => {
        this.setState({ someone });
    };

    onGreet = () => {
        const { someone } = this.state;
        Actions.greeting({ someone });
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Enter your name"
                        style={styles.input}
                        autoFocus={true}
                        editable={true}
                        spellCheck={false}
                        autoCapitalize="none"
                        onChangeText={this.onNameChange}
                    />
                </View>

                <Button
                    onPress={this.onGreet}
                    style={styles.buttonText}
                    containerStyle={styles.button}>
                    Greet
                </Button>
            </View>
        );
    }
}
