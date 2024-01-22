import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme, useThemeMode} from '@rneui/themed';
import {createStackNavigator} from '@react-navigation/stack';
import Username from '../Screens/Username';
import ConfirmUser from '../Screens/ConfirmUser';
import AddProfileImage from '../Screens/AddProfileImage';
import CreateNewUser from '../Screens/CreateNewUser';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const CheckUserExists = () => {
  const {theme} = useTheme();
  const {mode} = useThemeMode();
  const Stack = createStackNavigator();
  return (
    <SafeAreaProvider
      style={{flex: 1, backgroundColor: theme.colors.background}}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={mode == 'dark' ? 'light-content' : 'dark-content'}
      />

      <Stack.Navigator>
        <Stack.Screen
          name="check-user-screen"
          component={ConfirmUser}
          options={{headerShown: false, presentation: 'card'}}
        />
        <Stack.Screen
          name="username-screen"
          component={Username}
          options={{headerShown: false, presentation: 'card'}}
        />
        <Stack.Screen
          name="add-profileImage-screen"
          component={AddProfileImage}
          options={{headerShown: false, presentation: 'card'}}
        />
        <Stack.Screen
          name="create-new-user"
          component={CreateNewUser}
          options={{headerShown: false, presentation: 'card'}}
        />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
};

export default CheckUserExists;

const styles = StyleSheet.create({});
