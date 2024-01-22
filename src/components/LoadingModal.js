import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';

const LoadingModal = ({isVisible, setIsVisible}) => {
  return (
    <View>
      <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Progress.Circle
            size={80}
            indeterminate={true}
            color={'#fff'}
            borderWidth={2}
          />
        </View>
      </Modal>
    </View>
  );
};

export default LoadingModal;

const styles = StyleSheet.create({});
