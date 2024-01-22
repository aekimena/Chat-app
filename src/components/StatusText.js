import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '@rneui/themed';
import IonIcons from 'react-native-vector-icons/Ionicons';

const StatusText = ({partnerTyping, isOnline, lastSeen}) => {
  const {theme} = useTheme();
  if (partnerTyping && isOnline) {
    return (
      <View>
        <Text
          style={[
            styles.statusText,
            {
              color: theme.colors.textColor,
            },
          ]}>
          Typing...
        </Text>
      </View>
    );
  } else if (isOnline) {
    return (
      <View style={[styles.flexRow, {gap: 5}]}>
        <IonIcons name="ellipse" size={5} color={theme.colors.textColor} />
        <Text
          style={[
            styles.statusText,
            {
              color: theme.colors.textColor,
            },
          ]}>
          Online
        </Text>
      </View>
    );
  } else {
    return (
      <Text
        style={[
          styles.statusText,
          {
            color: theme.colors.textColor,
          },
        ]}>
        Last seen on {lastSeen}
      </Text>
    );
  }
};

export default StatusText;

const styles = StyleSheet.create({
  statusText: {
    fontSize: 15,
  },
  flexRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
});
