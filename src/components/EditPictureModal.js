import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {useTheme, useThemeMode} from '@rneui/themed';

const EditPicture = ({isModalVisible, setModalVisible, openLibrary}) => {
  const {theme} = useTheme();
  const {mode} = useThemeMode();
  return (
    <View>
      <Modal
        onBackButtonPress={() => {
          setModalVisible(false);
        }}
        onBackdropPress={() => {
          setModalVisible(false);
        }}
        animationIn="bounceInUp"
        animationOut="bounceOutDown"
        backdropOpacity={0.1}
        animationInTiming={100}
        useNativeDriverForBackdrop
        animationOutTiming={100}
        isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <View
            style={[
              styles.infoBox,
              {backgroundColor: mode == 'dark' ? '#222' : '#fff'},
            ]}>
            <View style={{paddingHorizontal: 15, gap: 7, paddingBottom: 10}}>
              <Text
                style={{
                  color: theme.colors.textColor,
                  fontSize: 22,
                }}>
                Edit profile image
              </Text>
            </View>

            <View
              style={{
                backgroundColor: '#888',
                height: 0.5,
                width: '100%',
              }}></View>

            <View style={styles.btnsContainer}>
              <Pressable onPress={null}>
                <Text
                  style={[
                    styles.btnText,
                    {
                      color: theme.colors.textColor,
                    },
                  ]}>
                  Edit
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  openLibrary();
                }}>
                <Text
                  style={[
                    styles.btnText,
                    {
                      color: theme.colors.textColor,
                    },
                  ]}>
                  Add New
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditPicture;

const styles = StyleSheet.create({
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
  },
  btnText: {
    fontSize: 20,
    fontWeight: '500',
  },
  infoBox: {
    height: 'auto',
    borderRadius: 10,
    paddingVertical: 15,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
});
