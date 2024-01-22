import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {StatusBar} from 'react-native';

const AddProfileImage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {username} = route.params;

  // skip to the next screen without a profile img
  const skip = () => {
    navigation.navigate('create-new-user', {
      username: username,
      profileImage: '',
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <View style={styles.headers}>
        <Text style={styles.headerTxt}>Add a Profile Picture</Text>
        <Pressable onPress={skip} style={{position: 'absolute', right: 0}}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>
      <View style={styles.boxBtnContainer}>
        <View style={styles.box}>
          <IonIcons name="camera" color={'#dcdcdc'} size={150} />
          <Text style={{color: '#777', fontSize: 20}}>Take a photo</Text>
        </View>
        <Pressable style={({pressed}) => [styles.uploadBtn]}>
          <Text style={{color: '#fff', fontSize: 20}}>Upload</Text>
          <IonIcons name="add-outline" color={'#fff'} size={25} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AddProfileImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  headers: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 20,
  },
  headerTxt: {
    color: '#222',
    fontSize: 20,
    fontWeight: '500',
  },
  skip: {
    fontSize: 20,
    fontWeight: '500',
    color: '#2698C9',
  },
  boxBtnContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
    paddingTop: 100,
  },
  box: {
    backgroundColor: '#f8f8f8',
    height: 250,
    width: 250,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBtn: {
    backgroundColor: '#6621D4',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
  },
});
