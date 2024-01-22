import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import {Input, Button} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {useApp} from '@realm/react';
import Realm from 'realm';
import LoadingModal from '../components/LoadingModal';

const Login = () => {
  const app = useApp();
  const navigation = useNavigation();
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [renderPasswordErr, setRenderPasswordErr] = useState(false);
  const [renderEmailErr, setRenderEmailErr] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);

  // sign in user
  const signIn = useCallback(async () => {
    const creds = Realm.Credentials.emailPassword(email, password);
    await app.logIn(creds);
  }, [app, email, password]);

  const handleSignIn = useCallback(async () => {
    try {
      setDialogVisible(true);
      await signIn().catch(() => {
        setDialogVisible(false);
        Alert.alert('Invalid email or password');
      });
    } catch (error) {
      setDialogVisible(false);
      Alert.alert('Something went wrong');
      console.log(error);
    }
  }, [signIn]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#fff'}}
      behavior="padding">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{flex: 1}}
        contentContainerStyle={{flex: 1}}>
        <View style={{gap: 20, marginTop: 20}}>
          <View
            style={{
              alignItems: 'center',
              marginVertical: 25,
            }}>
            <Text style={styles.headerTxt}>Levon chat</Text>
          </View>
          <Input
            placeholder="Email"
            leftIcon={{
              type: 'ionicons',
              name: 'person-outline',
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
            keyboardType="email-address"
            containerStyle={{paddingHorizontal: 15}}
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
            secureTextEntry
            inputContainerStyle={styles.textInput}
            placeholderTextColor={'#888'}
            inputStyle={{color: '#222', fontSize: 18}}
            defaultValue={password}
            onChangeText={newText => setPassword(newText)}
            containerStyle={{paddingHorizontal: 15}}
          />
          <Button
            title="Log in"
            buttonStyle={{
              backgroundColor: '#5F26A8',
              borderRadius: 10,
            }}
            titleStyle={{fontWeight: 'bold', fontSize: 23}}
            containerStyle={styles.btn}
            onPress={handleSignIn}
          />
          <View style={styles.question}>
            <Text style={styles.questionTxt}>Don't have an account?</Text>
            <Pressable
              onPress={() => navigation.navigate('emailPassword-screen')}>
              <Text style={styles.signUpTxt}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <LoadingModal isVisible={dialogVisible} setIsVisible={setDialogVisible} />
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  flexStyle: {
    flex: 1,
  },
  questionTxt: {
    fontSize: 18,
    fontWeight: '500',
    color: '#222',
  },
  signUpTxt: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2698C9',
  },
  headerTxt: {
    fontSize: 30,
    fontWeight: '500',
    color: '#222',
  },
  textInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 0,
  },
  btn: {
    paddingHorizontal: 15,
    height: 50,
    width: '100%',
    marginTop: 10,
  },
  question: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
});
