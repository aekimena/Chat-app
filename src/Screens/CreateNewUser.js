import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useObject, useQuery, useRealm, useUser} from '@realm/react';
import {User} from '../Schemas/userSchema';
import {useTheme} from '@rneui/themed';
import {BSON} from 'realm';
import * as Progress from 'react-native-progress';

const CreateNewUser = () => {
  const {theme} = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const user = useUser();
  const realm = useRealm();
  const userData = useObject(User, BSON.ObjectId.createFromHexString(user?.id));
  const {username, profileImage} = route.params;

  // get the latest update of all users
  const suscribedItems = realm.objects(User);
  const updateSuscription = async () => {
    await realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(suscribedItems);
    });
  };
  useEffect(() => {
    updateSuscription();
  }, []);

  // create a userschema for the user
  const createNewUser = useCallback(() => {
    realm.write(() => {
      return new User(realm, {
        _id: userData._id,
        username: username,
        profileImage: profileImage,
        createdAt: new Date(),
      });
    });
  }, [realm, user]);

  function createUser() {
    try {
      createNewUser();
      navigation.navigate('bottom-tab-screens');
      console.log('user created');
    } catch (error) {
      console.log(error);
      navigation.navigate('username-screen');
    }
  }

  useEffect(() => {
    createUser();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}>
      <Progress.Circle
        size={80}
        indeterminate={true}
        color={theme.colors.textColor}
        borderWidth={2}
      />
    </View>
  );
};

export default CreateNewUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
