import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Input, useTheme, useThemeMode} from '@rneui/themed';
import {useObject, useQuery, useUser} from '@realm/react';
import Icon from 'react-native-vector-icons/Ionicons';
import {User} from '../Schemas/userSchema';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BSON} from 'realm';
import {FocusedScreen} from '../contexts/focusedScreenContext';
import * as Progress from 'react-native-progress';
import RenderFollowing from '../components/RenderFollowing';

const SearchFollowing = () => {
  const {theme} = useTheme();
  const {mode} = useThemeMode();
  const user = useUser();
  const [text, setText] = useState('');
  const userData = useObject(User, BSON.ObjectId.createFromHexString(user?.id));
  const allUsers = useQuery(User);
  const navigation = useNavigation();
  const {setFocusedScreen} = useContext(FocusedScreen);

  // get the data of all followed users
  const userSchema = userData?.following.map(ids => {
    const foundUser = allUsers.find(
      obj => obj._id.toHexString() == ids.toHexString(),
    );
    if (foundUser) {
      return foundUser;
    }
  });

  const [dataLoading, setDataLoading] = useState(false);
  const [users, setUsers] = useState([]);

  function displayUsers() {
    setDataLoading(true);
    setUsers(userSchema);
    setDataLoading(false);
  }

  function searchUsers(input) {
    setText(input);
    setDataLoading(true);
    if (input == '') {
      setUsers(userSchema);
    } else {
      const usersSearched = userSchema.filter(obj =>
        obj.username.toLowerCase().includes(input.toLowerCase()),
      );
      setUsers(usersSearched);
    }
    setDataLoading(false);
  }

  useEffect(() => {
    displayUsers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setFocusedScreen(null);
    }, []),
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      <View style={styles.headers}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-back-outline"
            size={25}
            color={theme.colors.textColor}
          />
        </Pressable>
        <Input
          placeholder="Search following"
          leftIcon={{
            type: 'ionicon',
            name: 'search',
            color: '#888',
            size: 20,
          }}
          inputContainerStyle={[
            styles.textInput,
            {backgroundColor: mode == 'dark' ? '#222' : '#f8f8f8'},
          ]}
          placeholderTextColor={'#888'}
          inputStyle={{color: '#fff', fontSize: 20}}
          defaultValue={text}
          onChangeText={newText => searchUsers(newText)}
          containerStyle={{paddingHorizontal: 0, height: 55, flex: 1}}
        />
      </View>
      {dataLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Progress.Circle
            size={80}
            indeterminate={true}
            color={theme.colors.textColor}
            borderWidth={2}
          />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item._id.toHexString()}
          showsVerticalScrollIndicator={false}
          renderItem={item => <RenderFollowing {...item} />}
          contentContainerStyle={{gap: 20}}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchFollowing;

const styles = StyleSheet.create({
  headers: {
    marginTop: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    borderRadius: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 0,
  },
});
