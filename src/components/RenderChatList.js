import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useObject, useQuery, useUser} from '@realm/react';
import {User} from '../Schemas/userSchema';
import {Messages} from '../Schemas/messageSchema';
import {useNavigation} from '@react-navigation/native';
import {useTheme, useThemeMode} from '@rneui/themed';
import {Image} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';

const RenderChatList = ({item}) => {
  const user = useUser();

  // get all partner ids in the conversations
  const partnerId = item.members.find(ids => ids.toHexString() !== user?.id);
  // get the data of the partners
  const partnerData = useObject(User, partnerId);
  const messageSchema = useQuery(Messages);
  // get the latest message in the conversation
  const latestMessage = messageSchema.find(
    obj =>
      obj._id.toHexString() ==
      item.messages[item.messages.length - 1].toHexString(),
  );
  // count the number of unseen texts
  const unreadCount = messageSchema.filter(
    obj =>
      item.messages.includes(obj._id) &&
      obj.status !== 'seen' &&
      obj.senderId.toHexString() !== user?.id,
  );
  const hours = latestMessage.createdAt.getHours();
  const minutes = latestMessage.createdAt.getMinutes();
  const navigation = useNavigation();
  const {mode} = useThemeMode();
  const {theme} = useTheme();
  return (
    <Pressable
      onPress={() =>
        navigation.navigate('message-screen', {
          partnerId: partnerData._id.toHexString(),
        })
      }
      style={({pressed}) => [
        styles.container,
        {
          backgroundColor: pressed
            ? mode == 'dark'
              ? '#333'
              : '#f8f8f8'
            : 'transparent',
        },
      ]}>
      <Image
        source={
          partnerData?.profileImage == ''
            ? require('../images/placeholder-img.jpg')
            : {uri: partnerData?.profileImage}
        }
        style={styles.partnerImg}
        resizeMode="cover"
      />

      <View style={{flex: 1, gap: 10}}>
        <View style={styles.flexAliG10}>
          <IonIcons
            name="ellipse-sharp"
            size={10}
            color={partnerData.isOnline ? '#87FC64' : '#777'}
          />
          <Text
            numberOfLines={1}
            style={{
              color: theme.colors.textColor,
              fontSize: 20,
              fontWeight: '500',
            }}>
            {partnerData.username}
          </Text>
        </View>

        <View style={[styles.flexAliG10, {gap: 5}]}>
          {latestMessage?.senderId.toHexString() == user?.id && (
            <IonIcons
              name={
                latestMessage?.status == 'sent' ? 'checkmark' : 'checkmark-done'
              }
              color={
                latestMessage?.status == 'seen'
                  ? '#499AF6'
                  : mode == 'dark'
                  ? '#d8d8d8'
                  : '#444'
              }
              size={16}
            />
          )}
          {latestMessage.text ? (
            <Text
              style={{
                color: mode == 'dark' ? '#d8d8d8' : '#444',
                fontSize: 18,
              }}
              numberOfLines={1}>
              {latestMessage?.text}
            </Text>
          ) : (
            <View style={[styles.flexAliG10, {gap: 5}]}>
              <IonIcons name="image" size={18} color={theme.colors.textColor} />
              <Text
                style={{
                  color: mode == 'dark' ? '#d8d8d8' : '#444',
                  fontSize: 18,
                }}>
                Photo
              </Text>
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          alignItems: 'flex-end',
          gap: 10,
        }}>
        <Text
          style={{
            color: theme.colors.textColor,
            fontSize: 15,
            fontWeight: '500',
          }}>{`${hours < 10 ? '0' + hours : hours}:${
          minutes < 10 ? '0' + minutes : minutes
        }`}</Text>

        {latestMessage.status !== 'seen' &&
          latestMessage.senderId.toHexString() !== user?.id && (
            <View
              style={[
                styles.unreadCount,
                {
                  backgroundColor: theme.colors.textColor,
                },
              ]}>
              <Text
                style={{
                  color: theme.colors.background,
                  fontWeight: '500',
                  fontSize: 16,
                }}>
                {unreadCount?.length}
              </Text>
            </View>
          )}
      </View>
    </Pressable>
  );
};

export default RenderChatList;

const styles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center', gap: 15, padding: 15},
  partnerImg: {
    height: 80,
    width: 80,
    borderRadius: 40,
    aspectRatio: 1,
  },
  flexAliG10: {flexDirection: 'row', alignItems: 'center', gap: 10},
  unreadCount: {
    minWidth: 25,
    paddingHorizontal: 3,
    paddingVertical: 2,
    borderRadius: 50,
    maxWidth: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
