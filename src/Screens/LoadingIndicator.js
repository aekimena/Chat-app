import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useTheme} from '@rneui/themed';
import * as Progress from 'react-native-progress';

const LoadingIndicator = () => {
  const {theme} = useTheme();
  return (
    <SafeAreaProvider
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={'dark-content'}
      />
      <Progress.Circle
        size={80}
        indeterminate={true}
        color={theme.colors.textColor}
        borderWidth={2}
      />
    </SafeAreaProvider>
  );
};

export default LoadingIndicator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
