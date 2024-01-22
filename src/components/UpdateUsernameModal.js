import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useContext, useState} from 'react';
import Modal from 'react-native-modal';
import {useTheme, useThemeMode} from '@rneui/themed';

const UpdateUsernameModal = ({
  checkFunc,
  setFunc,
  isModalShown,
  setIsModalShown,
  inputText,
  usernameExists,
  infoColor,
  setInputText,
}) => {
  const {theme} = useTheme();
  const {mode} = useThemeMode();

  return (
    <View>
      <Modal
        onBackButtonPress={() => {
          setInputText('');
          setIsModalShown(false);
        }}
        onBackdropPress={() => {
          setInputText('');
          setIsModalShown(false);
        }}
        animationIn="bounceInUp"
        animationOut="bounceOutDown"
        backdropOpacity={0.1}
        animationInTiming={100}
        useNativeDriverForBackdrop
        animationOutTiming={100}
        avoidKeyboard={true}
        isVisible={isModalShown}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.infoBox,
              {backgroundColor: mode == 'dark' ? '#222' : '#fff'},
            ]}>
            <View style={styles.container}>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: theme.colors.textColor,
                    backgroundColor: mode == 'dark' ? '#333' : '#f8f8f8',
                  },
                ]}
                defaultValue={inputText}
                onChangeText={newText => checkFunc(newText)}
                autoFocus
                placeholder="Type in username"
                placeholderTextColor={'#999'}
                multiline
              />
              {inputText !== '' && (
                <Text style={{color: infoColor, fontSize: 16}}>
                  {usernameExists
                    ? 'This username is taken'
                    : 'This username is available'}
                </Text>
              )}
            </View>

            <Pressable
              disabled={usernameExists}
              onPress={setFunc}
              style={({pressed}) => [
                styles.updateBtn,
                {
                  backgroundColor: pressed ? '#333' : '#6621D4',
                },
              ]}>
              <Text style={{color: '#fff', fontSize: 20}}>Update</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UpdateUsernameModal;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 'auto',
    borderRadius: 10,
  },
  textInput: {
    height: 'auto',
    width: '100%',

    fontSize: 20,
    fontWeight: '400',
    padding: 10,

    borderRadius: 10,
  },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  infoBox: {
    height: 'auto',
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 15,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
