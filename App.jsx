import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ThemeProvider, createTheme} from '@rneui/themed';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabScreens from './src/navigators/BottomTabScreens';
import 'react-native-gesture-handler';
import LoadingIndicator from './src/Screens/LoadingIndicator';
import {RealmProvider} from '@realm/react';
import {User} from './src/Schemas/userSchema';
import {Messages} from './src/Schemas/messageSchema';
import {Conversations} from './src/Schemas/conversationsSchema';
import CheckUserExists from './src/navigators/CheckUserExists';
import MessageScreen from './src/Screens/MessageScreen';
import SelectImgProvider from './src/contexts/selectImgContext';
import OnlineStatusProvider from './src/contexts/OnlineStatusContext';
import FocusedScreenProvider from './src/contexts/focusedScreenContext';
import OtherUsersPage from './src/Screens/OtherUserPage';

const App = () => {
  const Stack = createStackNavigator();
  const theme = createTheme({
    lightColors: {
      background: '#fff',
      textColor: '#222',
    },
    darkColors: {
      background: '#111',
      textColor: '#fff',
    },
    mode: 'light',
  });

  return (
    <ThemeProvider theme={theme}>
      <RealmProvider
        sync={{
          flexible: true,
          onError: err => {
            console.error(err);
          },
        }}
        schema={[User, Messages, Conversations]}
        schemaVersion={1}
        fallback={LoadingIndicator}>
        <FocusedScreenProvider>
          <OnlineStatusProvider>
            <SelectImgProvider>
              <NavigationContainer>
                <Stack.Navigator>
                  <Stack.Screen
                    name="check-user-exists"
                    component={CheckUserExists}
                    options={{headerShown: false, presentation: 'card'}}
                  />

                  <Stack.Screen
                    name="bottom-tab-screens"
                    component={BottomTabScreens}
                    options={{headerShown: false, presentation: 'card'}}
                  />
                  <Stack.Screen
                    name="message-screen"
                    component={MessageScreen}
                    options={{headerShown: false, presentation: 'card'}}
                  />
                  <Stack.Screen
                    name="userProfile-screen"
                    component={OtherUsersPage}
                    options={{headerShown: false, presentation: 'card'}}
                  />
                  <Stack.Screen
                    name="loading-indicator"
                    component={LoadingIndicator}
                    options={{headerShown: false, presentation: 'card'}}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </SelectImgProvider>
          </OnlineStatusProvider>
        </FocusedScreenProvider>
      </RealmProvider>
    </ThemeProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
