import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Input, Button} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {useApp} from '@realm/react';
import Realm from 'realm';
import LoadingModal from '../components/LoadingModal';
import IonIcons from 'react-native-vector-icons/Ionicons';

const EmailPassword = () => {
  const navigation = useNavigation();
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [renderPasswordErr, setRenderPasswordErr] = useState(false);
  const [renderEmailErr, setRenderEmailErr] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const app = useApp();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // sign in user
  const signIn = useCallback(async () => {
    const creds = Realm.Credentials.emailPassword(email, password);
    await app.logIn(creds);
  }, [app, email, password]);

  const handleSignUp = useCallback(async () => {
    try {
      setIsModalVisible(true);
      await app.emailPasswordAuth.registerUser({email, password});
      await signIn(); // sign in user after registration
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert('Failed to register');
      console.log(error);
      setIsModalVisible(false);
    }
  }, [signIn, app, email, password]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{flex: 1}}
        contentContainerStyle={{flex: 1}}>
        <View style={{gap: 20, marginTop: 20}}>
          <View style={styles.headers}>
            <Pressable
              style={{position: 'absolute', left: 0}}
              onPress={() => navigation.goBack()}>
              <IonIcons name="chevron-back-outline" color={'#222'} size={30} />
            </Pressable>

            <Text style={styles.headerTxt}>Levon chat</Text>
          </View>
          <Input
            placeholder="Email"
            leftIcon={{
              type: 'ionicons',
              name: 'mail-outline',
              color: '#222',
              size: 20,
            }}
            errorStyle={{color: 'red', fontSize: 15}}
            errorMessage={emailErrorMessage}
            renderErrorMessage={renderEmailErr}
            inputContainerStyle={styles.textInput}
            placeholderTextColor={'#888'}
            inputStyle={{color: '#222', fontSize: 18}}
            defaultValue={email}
            onChangeText={newText => setEmail(newText)}
            containerStyle={{paddingHorizontal: 0}}
            keyboardType="email-address"
          />
          <Input
            placeholder="Password"
            leftIcon={{
              type: 'ionicon',
              name: 'lock-closed-outline',
              color: '#222',
              size: 20,
            }}
            rightIcon={{
              type: 'ionicon',
              name: 'eye-outline',
              color: '#222',
              size: 20,
              pressableProps: {onTouchStart: () => console.log('pressed')},
            }}
            errorStyle={{color: 'red', fontSize: 15}}
            errorMessage={passwordErrorMessage}
            renderErrorMessage={renderPasswordErr}
            inputContainerStyle={styles.textInput}
            secureTextEntry
            placeholderTextColor={'#888'}
            inputStyle={{color: '#222', fontSize: 18}}
            defaultValue={password}
            onChangeText={newText => setPassword(newText)}
            containerStyle={{paddingHorizontal: 0}}
          />
          <Button
            title="Sign up"
            loading={false}
            loadingProps={{size: 'large', color: 'white'}}
            buttonStyle={{
              backgroundColor: '#5F26A8',
              borderRadius: 10,
            }}
            titleStyle={{fontWeight: 'bold', fontSize: 23}}
            containerStyle={styles.btn}
            onPress={handleSignUp}
          />
        </View>
      </ScrollView>
      <LoadingModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
      />
    </KeyboardAvoidingView>
  );
};

export default EmailPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  textBold: {
    fontSize: 18,
    fontWeight: '500',
  },
  headers: {
    alignItems: 'center',
    marginVertical: 25,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 0,
  },
  btn: {
    height: 50,
    width: '100%',
    marginTop: 10,
  },
  headerTxt: {
    fontSize: 30,
    fontWeight: '500',
    color: '#222',
  },
});
