import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Icon, useTheme, useThemeMode} from '@rneui/themed';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useObject, useQuery, useRealm, useUser} from '@realm/react';
import {User} from '../Schemas/userSchema';
import {BSON} from 'realm';

const OtherUsersPage = () => {
  const navigation = useNavigation();
  const user = useUser();
  const realm = useRealm();
  const {theme} = useTheme();
  const {mode} = useThemeMode();
  const route = useRoute();
  const {partnerId} = route.params;
  const [userData, setUserData] = useState([]);
  const existingUser = useObject(
    User,
    BSON.ObjectId.createFromHexString(partnerId),
  );
  const appUser = useObject(User, BSON.ObjectId.createFromHexString(user?.id));

  // function to follow user
  const followUser = useCallback(() => {
    if (existingUser) {
      try {
        realm.write(() => {
          existingUser.followers = [...existingUser.followers, appUser?._id];
        });
        realm.write(() => {
          appUser.following = [...appUser.following, existingUser?._id];
        });
        console.log('followed');
      } catch (error) {
        console.log(error);
      }
    }
  }, [realm, user]);

  // unfollow user
  const unFollowUser = useCallback(() => {
    if (existingUser) {
      try {
        realm.write(() => {
          existingUser.followers = existingUser.followers.filter(
            ids => ids.toHexString() !== user?.id,
          );
        });
        realm.write(() => {
          appUser.following = appUser.following.filter(
            ids => ids.toHexString() !== existingUser?._id,
          );
        });
        console.log('unfollowed');
      } catch (error) {
        console.log(error);
      }
    }
  }, [realm, user]);

  // get latest update of all users
  const suscribedItems = realm.objects(User);
  const updateSuscription = async () => {
    await realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(suscribedItems, {name: 'users'});
    });
  };
  useEffect(() => {
    updateSuscription();
  }, [realm, user]);

  const getUserData = useCallback(() => {
    try {
      if (existingUser) {
        setUserData(existingUser);
      }
    } catch (error) {
      console.log(error);
    }
  }, [realm, user]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  // check if user is following
  const userIsFollowing = userData?.followers?.includes(appUser?._id);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 15,
      }}>
      <View style={styles.headers}>
        <Pressable onPress={() => navigation.goBack()}>
          <IonIcons
            name="arrow-back-outline"
            size={25}
            color={theme.colors.textColor}
          />
        </Pressable>
        <Pressable>
          <IonIcons
            name="ellipsis-horizontal"
            size={25}
            color={theme.colors.textColor}
          />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{marginTop: 15}}>
        <View style={{gap: 15, alignItems: 'center'}}>
          <Image
            source={
              userData?.profileImage == ''
                ? require('../images/placeholder-img.jpg')
                : {uri: userData?.profileImage}
            }
            style={styles.profileImage}
            resizeMode="cover"
          />

          <Text
            style={{
              color: theme.colors.textColor,
              fontSize: 20,
              fontWeight: '500',
            }}>
            @{userData?.username}
          </Text>
          <View style={styles.followCont}>
            <View style={{alignItems: 'center'}}>
              <Text
                style={[
                  styles.followNum,
                  {
                    color: theme.colors.textColor,
                  },
                ]}>
                {userData?.followers?.length}
              </Text>
              <Text style={styles.followText}>Followers</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text
                style={[
                  styles.followNum,
                  {
                    color: theme.colors.textColor,
                  },
                ]}>
                {userData?.following?.length}
              </Text>
              <Text style={styles.followText}>Following</Text>
            </View>
          </View>

          <View style={styles.flexRow}>
            <Pressable
              onPress={userIsFollowing ? unFollowUser : followUser}
              style={[styles.follow_message_btn, {backgroundColor: '#499AF6'}]}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                }}>
                {userIsFollowing ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
            {userIsFollowing && (
              <Pressable
                onPress={() =>
                  navigation.navigate('message-screen', {
                    partnerId: userData._id,
                  })
                }
                style={[
                  styles.follow_message_btn,
                  {backgroundColor: mode == 'dark' ? '#222' : '#f8f8f8'},
                ]}>
                <Text
                  style={{
                    color: theme.colors.textColor,
                    fontSize: 20,
                  }}>
                  Message
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtherUsersPage;

const styles = StyleSheet.create({
  profileImage: {
    height: 170,
    width: 170,
    borderRadius: 85,
  },
  follow_message_btn: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 10,
  },
  headers: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  followCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  followNum: {
    fontWeight: '500',
    fontSize: 20,
  },
  followText: {
    color: '#999',
    fontWeight: '400',
    fontSize: 16,
  },
  flexRow: {flexDirection: 'row', alignItems: 'center', gap: 20},
});
