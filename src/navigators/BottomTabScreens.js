import {Pressable, StatusBar, StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import Chats from '../Screens/Chats';

import {createStackNavigator} from '@react-navigation/stack';
import {useTheme, useThemeMode} from '@rneui/themed';
import {Badge} from '@rneui/themed';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import UserPage from '../Screens/UserPage';
import {useNavigation} from '@react-navigation/native';
import {useQuery, useRealm, useUser} from '@realm/react';
import {Messages} from '../Schemas/messageSchema';
import {BSON} from 'realm';

import {FocusedScreen} from '../contexts/focusedScreenContext';
import SearchFollowing from '../Screens/SearchFollowing';
import SearchUsers from '../Screens/SearchUsers';

const BottomTabScreens = () => {
  const Stack = createStackNavigator();
  const {theme} = useTheme();
  const {mode} = useThemeMode();
  const navigation = useNavigation();
  const user = useUser();

  // get unread texts
  const unread = useQuery(Messages).filter(
    obj =>
      obj.status !== 'seen' &&
      obj.recepientId.includes(BSON.ObjectId.createFromHexString(user?.id)),
  );

  const {focusedScreen} = useContext(FocusedScreen);

  const [unreadTexts, setUnreadTexts] = useState(null);

  useEffect(() => {
    setUnreadTexts(unread);
  }, []);

  return (
    <SafeAreaProvider
      style={{flex: 1, backgroundColor: theme.colors.background}}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={mode == 'light' ? 'dark-content' : 'light-content'}
      />

      <Stack.Navigator initialRouteName="chats-screen">
        <Stack.Screen
          name="chats-screen"
          component={Chats}
          options={{headerShown: false, presentation: 'card'}}
        />
        <Stack.Screen
          name="userPage-screen"
          component={UserPage}
          options={{headerShown: false, presentation: 'card'}}
        />
        <Stack.Screen
          name="searchFollowing-screen"
          component={SearchFollowing}
          options={{headerShown: false, presentation: 'card'}}
        />
        <Stack.Screen
          name="searchUsers-screen"
          component={SearchUsers}
          options={{headerShown: false, presentation: 'card'}}
        />
      </Stack.Navigator>

      {/* bottom tab component */}
      <View
        style={[
          styles.bottomTab,
          {
            backgroundColor:
              mode == 'dark' ? 'rgba(34, 34, 34, 0.97)' : '#f8f8f8',
          },
        ]}>
        <Pressable onPress={() => navigation.navigate('chats-screen')}>
          <IonIcons
            name={focusedScreen == 1 ? 'chatbubbles' : 'chatbubbles-outline'}
            color={theme.colors.textColor}
            size={25}
          />
          {unreadTexts?.length > 0 && (
            <Badge
              value={unreadTexts?.length}
              badgeStyle={{
                backgroundColor: 'red',
              }}
              containerStyle={styles.containerStyle}
            />
          )}
        </Pressable>
        <Pressable>
          <IonIcons
            name="people-outline"
            color={theme.colors.textColor}
            size={25}
          />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('searchFollowing-screen')}
          style={styles.addBtn}>
          <IonIcons name="add-outline" color={'#fff'} size={30} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('searchUsers-screen')}>
          <IonIcons
            name={focusedScreen == 3 ? 'search' : 'search-outline'}
            color={theme.colors.textColor}
            size={25}
          />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('userPage-screen')}>
          <IonIcons
            name={focusedScreen == 4 ? 'person' : 'person-outline'}
            color={theme.colors.textColor}
            size={25}
          />
        </Pressable>
      </View>
    </SafeAreaProvider>
  );
};

export default BottomTabScreens;

const styles = StyleSheet.create({
  bottomTab: {
    width: '90%',
    height: 80,
    borderRadius: 20,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  containerStyle: {
    position: 'absolute',
    top: -5,
    right: -15,
    width: 'auto',
    minWidth: 30,
  },
  addBtn: {
    backgroundColor: '#6621D4',
    height: 55,
    width: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
