import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme, useThemeMode} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {Image} from 'react-native';

const RenderUsers = ({item}) => {
  const {theme} = useTheme();
  const {mode} = useThemeMode();
  const navigation = useNavigation();
  return (
    <Pressable
      style={({pressed}) => [
        styles.container,
        {
          backgroundColor: pressed
            ? mode == 'dark'
              ? '#333'
              : '#f8f8f8'
            : 'transparent',
        },
      ]}
      onPress={() =>
        navigation.navigate('userProfile-screen', {
          partnerId: item._id.toHexString(),
        })
      }>
      <Image
        source={
          item.profileImage == ''
            ? require('../images/placeholder-img.jpg')
            : {uri: item.profileImage}
        }
        resizeMode="cover"
        style={styles.image}
      />

      <Text
        style={[
          styles.username,
          {
            color: theme.colors.textColor,
          },
        ]}>
        {item.username}
      </Text>
    </Pressable>
  );
};

export default RenderUsers;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 15,
  },
  username: {
    fontSize: 20,
    fontWeight: '500',
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 40,
    aspectRatio: 1,
  },
});
