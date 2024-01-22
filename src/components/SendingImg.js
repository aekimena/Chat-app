import {StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import {Image} from 'react-native';
import * as Progress from 'react-native-progress';
import {SelectImg} from '../contexts/selectImgContext';

const SendingImg = () => {
  const {image} = useContext(SelectImg);
  return (
    <View style={styles.loadingImgContainer}>
      <Image
        source={{uri: image?.uri}}
        style={styles.loadingImg}
        resizeMethod="resize"
      />
      <View style={{position: 'absolute'}}>
        <Progress.Circle
          size={60}
          indeterminate={true}
          color={'#fff'}
          borderWidth={2}
        />
      </View>
    </View>
  );
};

export default SendingImg;

const styles = StyleSheet.create({
  loadingImgContainer: {
    height: 260,
    width: 260,
    backgroundColor: '#6621D4',
    borderRadius: 10,
    borderTopRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  loadingImg: {
    height: 250,
    width: 250,
    borderRadius: 10,
    opacity: 0.5,
  },
});
