import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import Modal from 'react-native-modal';
import {SelectImg} from '../contexts/selectImgContext';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {useThemeMode} from '@rneui/themed';

const SendImageModal = ({
  modalVisible,
  setIsModalVisible,
  sendImage,
  username,
}) => {
  const {image} = useContext(SelectImg);
  const {mode} = useThemeMode();
  return (
    <View>
      <Modal
        isVisible={modalVisible}
        backdropOpacity={0.8}
        style={{margin: 0}}
        onBackButtonPress={() => setIsModalVisible(false)}>
        <View
          style={{
            flex: 1,
            paddingVertical: 15,
          }}>
          <View style={styles.headers}>
            <Pressable onPress={() => setIsModalVisible(false)}>
              <IonIcons name="close-outline" size={35} color={'#fff'} />
            </Pressable>

            <View style={styles.flexRowG25}>
              <IonIcons name="crop-outline" size={30} color={'#fff'} />
              <IonIcons name="create-outline" size={30} color={'#fff'} />
            </View>
          </View>
          <View style={styles.imgContainer}>
            {/* image here */}
            {image.uri && (
              <Image
                source={{uri: image.uri}}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="contain"
              />
            )}
          </View>
          <View style={{gap: 10, paddingHorizontal: 15}}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: mode == 'dark' ? '#333' : '#555',
                },
              ]}
              placeholder="Add a caption..."
              placeholderTextColor={'#fff'}
              maxLength={50}
            />
            <View style={styles.flexRowBtw}>
              <Pressable
                style={[
                  styles.username,
                  {
                    backgroundColor: mode == 'dark' ? '#333' : '#555',
                  },
                ]}>
                <Text style={{color: '#fff', fontSize: 20}}>{username}</Text>
              </Pressable>
              <Pressable onPress={sendImage} style={styles.sendBtn}>
                <IonIcons name="send" size={25} color={'#fff'} />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SendImageModal;

const styles = StyleSheet.create({
  headers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  flexRowG25: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,
  },
  imgContainer: {
    gap: 20,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 55,
    borderRadius: 17,
    borderWidth: 0.5,
    paddingHorizontal: 15,
    fontSize: 20,
  },
  flexRowBtw: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  username: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    backgroundColor: '#499AF6',
    height: 55,
    width: 55,
    paddingHorizontal: 10,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
