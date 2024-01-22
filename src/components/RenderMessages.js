import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme, useThemeMode} from '@rneui/themed';
import {useUser} from '@realm/react';
import {Image} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';

const RenderMessages = ({item, arr, selectMode, setSelectMode, setArr}) => {
  const user = useUser();
  const hours = item.createdAt.getHours();
  const minutes = item.createdAt.getMinutes();
  const {mode} = useThemeMode();
  const {theme} = useTheme();

  // function to handle press if select mode is true
  function handlePress() {
    if (selectMode) {
      if (arr?.length < 2 && arr.includes(item._id.toHexString())) {
        setArr([]);
        setSelectMode(false);
      } else {
        if (!arr.includes(item._id.toHexString())) {
          setArr([...arr, item._id.toHexString()]);
        } else {
          setArr(arr.filter(ids => ids !== item._id.toHexString()));
        }
      }
    }
  }

  // function to activate select mode
  function handleLongPress() {
    if (!selectMode) {
      setSelectMode(true);
      setArr([...arr, item._id.toHexString()]);
    }
  }
  return (
    <>
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={[
          styles.container,
          {
            alignSelf:
              item.senderId.toHexString() == user?.id
                ? 'flex-end'
                : 'flex-start',
          },
        ]}>
        <View
          style={{
            backgroundColor: arr.includes(item._id.toHexString())
              ? 'rgba(114, 219, 220, 0.2)'
              : item.senderId.toHexString() == user?.id
              ? '#6621D4'
              : mode == 'dark'
              ? '#333'
              : '#fff',
            borderTopRightRadius:
              item.senderId.toHexString() == user?.id ? 0 : 17,
            borderTopLeftRadius:
              item.senderId.toHexString() == user?.id ? 17 : 0,
            borderRadius: 17,
            padding: item.text ? 12 : 5,
          }}>
          {item.text ? (
            <Text
              style={{
                color:
                  item.senderId.toHexString() == user?.id
                    ? '#fff'
                    : theme.colors.textColor,
                fontSize: 20,
                fontWeight: '400',
              }}>
              {item.text}
            </Text>
          ) : (
            <Image
              source={{uri: item.image}}
              resizeMode="cover"
              style={[
                styles.image,
                {
                  opacity: arr.includes(item._id.toHexString()) ? 0.3 : 1,
                },
              ]}
            />
          )}
        </View>
        <View
          style={[
            styles.timeCheckContainer,
            {
              alignSelf:
                item.senderId.toHexString() == user?.id
                  ? 'flex-end'
                  : 'flex-start',
            },
          ]}>
          <Text
            style={{
              color: '#999',
              fontSize: 14,
            }}>
            {`${hours < 10 ? '0' + hours : hours}:${
              minutes < 10 ? '0' + minutes : minutes
            }`}
          </Text>
          {item.senderId.toHexString() == user?.id && (
            <IonIcons
              name={item.status == 'sent' ? 'checkmark' : 'checkmark-done'}
              color={item.status == 'seen' ? '#499AF6' : '#999'}
              size={17}
            />
          )}
        </View>
      </Pressable>
    </>
  );
};

export default RenderMessages;

const styles = StyleSheet.create({
  container: {
    maxWidth: 300,
    minWidth: 80,
    gap: 2,
    marginVertical: 10,
  },
  timeCheckContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  image: {
    height: 250,
    width: 250,
    borderRadius: 17,
  },
});
