import {StatusBar, StyleSheet} from 'react-native';
import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import Login from '../Screens/Login';
import EmailPassword from '../Screens/EmailPassword';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';

const AuthScreens = () => {
  const Stack = createStackNavigator();

  return (
    <SafeAreaProvider style={{flex: 1, backgroundColor: '#111'}}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="login-screen"
            component={Login}
            options={{headerShown: false, presentation: 'card'}}
          />

          <Stack.Screen
            name="emailPassword-screen"
            component={EmailPassword}
            options={{headerShown: false, presentation: 'card'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AuthScreens;

const styles = StyleSheet.create({});
