import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import Modal from 'react-native-modal';
import {SelectImg} from '../contexts/selectImgContext';
import IonIcons from 'react-native-vector-icons/Ionicons';

const AddNewPictureModal = ({modal, setModal, sendImage}) => {
  const {image} = useContext(SelectImg);
  return (
    <View>
      <Modal
        isVisible={modal}
        backdropOpacity={0.8}
        style={{margin: 0}}
        onBackButtonPress={() => setIsModalVisible(false)}>
        <View style={styles.container}>
          <View style={styles.headers}>
            <Pressable onPress={() => setModal(false)}>
              <IonIcons name="close-outline" size={35} color={'#fff'} />
            </Pressable>

            <View style={styles.flexRowG25}>
              <IonIcons name="crop-outline" size={30} color={'#fff'} />
              <IonIcons name="create-outline" size={30} color={'#fff'} />
            </View>
          </View>
          <View style={styles.imgContainer}>
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
          <View style={{gap: 10, padding: 15}}>
            <Pressable
              onPress={sendImage}
              style={({pressed}) => [
                styles.uploadBtn,
                {
                  backgroundColor: pressed ? '#333' : '#6621D4',
                },
              ]}>
              <Text style={{color: '#fff', fontSize: 20}}>Upload</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddNewPictureModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
  },
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
  uploadBtn: {
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
});
