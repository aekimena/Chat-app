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
import RenderUsers from '../components/RenderUsers';
import * as Progress from 'react-native-progress';

const SearchUsers = () => {
  const {theme} = useTheme();
  const {mode} = useThemeMode();
  const user = useUser();
  const [text, setText] = useState('');
  const userData = useObject(User, BSON.ObjectId.createFromHexString(user?.id));
  const allUsers = useQuery(User).filter(
    obj => obj._id.toHexString() !== userData._id.toHexString(),
  );
  const navigation = useNavigation();
  const {setFocusedScreen} = useContext(FocusedScreen);

  const [dataLoading, setDataLoading] = useState(false);
  const [users, setUsers] = useState([]);

  function displayUsers() {
    setDataLoading(true);
    setUsers(allUsers);
    setDataLoading(false);
  }

  function searchUsers(input) {
    setText(input);
    setDataLoading(true);
    if (input == '') {
      setUsers(allUsers);
    } else {
      const usersSearched = allUsers.filter(obj =>
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
      setFocusedScreen(3);
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
          placeholder="Search"
          leftIcon={{
            type: 'ionicon',
            name: 'search',
            color: '#888',
            size: 20,
          }}
          inputContainerStyle={[
            styles.textInput,
            {
              backgroundColor: mode == 'dark' ? '#222' : '#f8f8f8',
            },
          ]}
          placeholderTextColor={'#888'}
          inputStyle={{color: '#222', fontSize: 20}}
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
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={item => <RenderUsers {...item} />}
          contentContainerStyle={{gap: 10}}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchUsers;

const styles = StyleSheet.create({
  image: {
    height: 80,
    width: 80,
    borderRadius: 40,
    aspectRatio: 1,
  },
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
