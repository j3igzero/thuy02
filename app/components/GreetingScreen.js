import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import styles from '../styles';

export default class GreetingScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Hello {this.props.someone}!</Text>
            </View>
        );
    }
}

GreetingScreen.propTypes = {
    someone: PropTypes.string.isRequired
};
