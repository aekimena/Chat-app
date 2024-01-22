/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {AppProvider, UserProvider} from '@realm/react';
import AuthScreens from './src/navigators/AuthScreens';

const Root = () => {
  return (
    <AppProvider id="your app id">
      <UserProvider fallback={AuthScreens}>
        <App />
      </UserProvider>
    </AppProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
