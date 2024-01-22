import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useApp, useObject, useQuery, useRealm, useUser} from '@realm/react';
import {User} from '../Schemas/userSchema';
import {BSON} from 'realm';
import {useTheme} from '@rneui/themed';
import * as Progress from 'react-native-progress';

const ConfirmUser = () => {
  const app = useApp();
  const {theme} = useTheme();
  const navigation = useNavigation();
  const user = useUser();
  const realm = useRealm();
  const userSchema = useQuery(User);
  const userData = useObject(User, BSON.ObjectId.createFromHexString(user?.id));

  // get latest update of all users
  const suscribedItems = realm.objects(User);
  const updateSuscription = async () => {
    await realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(suscribedItems);
    });
  };
  useEffect(() => {
    updateSuscription();
  }, [realm, user]);

  // check if a userschema is already created for the user
  const confirmUser = useCallback(async () => {
    try {
      const userExists = await userSchema.find(
        obj => obj._id.toHexString() == userData?._id.toHexString(),
      );
      if (userExists) {
        navigation.replace('bottom-tab-screens');
        console.log('user exists');
      } else {
        navigation.navigate('username-screen');
        console.log('user does not exist');
      }
    } catch (error) {
      console.log(error);
    }
  }, [realm, user, app]);
  useEffect(() => {
    confirmUser();
  }, [confirmUser]);
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

export default ConfirmUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
