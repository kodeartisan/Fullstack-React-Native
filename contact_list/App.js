import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AppNavigator from './routes';

export default class App extends React.Component {
  render() {
    return (
        <AppNavigator/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    
  },
});
