import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Input, Button} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {useQuery, useRealm, useUser} from '@realm/react';
import {User} from '../Schemas/userSchema';

// generate randow values
function getRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    // Generate a random index to pick a character from the characters string
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

const Username = () => {
  const [usernameErrorMessage, setusernameErrorMessage] = useState('');
  const [renderUsernameErr, setRenderUsernameErr] = useState(false);
  const [username, setUsername] = useState('');
  const [authState, setAuthState] = useState(false);
  const [randomVal, setRandomVal] = useState(`user${getRandomString(6)}`);
  const navigation = useNavigation();
  const user = useUser();
  const realm = useRealm();
  const userSchema = useQuery(User);

  const generateRandomVal = () => {
    setRandomVal(`user${getRandomString(6)}`);
  };

  // get latest update of all users
  const suscribedItems = realm.objects(User);
  const updateSuscription = async () => {
    await realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(suscribedItems);
    });
  };
  useEffect(() => {
    updateSuscription();
  }, [realm, user]);

  useEffect(() => {
    userSchema.map(obj => {
      if (obj.username == randomVal) {
        generateRandomVal();
      }
    });
  });

  // check if username is taken
  function checkUsername() {
    setRenderUsernameErr(false);
    try {
      const usernameExists = userSchema.find(obj => obj.username === username);
      if (username !== '') {
        if (usernameExists) {
          setRenderUsernameErr(true);
          setusernameErrorMessage('This user name is taken');
          setAuthState(false);
        } else {
          setRenderUsernameErr(true);
          setusernameErrorMessage('This user name is available');
          setAuthState(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkUsername();
  }, [username]);

  // go to the next page with a random username
  function skip() {
    navigation.navigate('add-profileImage-screen', {username: randomVal});
  }

  // go to the next page with the chosen username
  function next() {
    authState
      ? navigation.navigate('add-profileImage-screen', {username: username})
      : null;
  }

  return (
    <>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{flex: 1}}
          contentContainerStyle={{flex: 1}}>
          <View style={{gap: 20, marginTop: 20}}>
            <Pressable onPress={skip} style={{alignSelf: 'flex-end'}}>
              <Text style={styles.skip}>Skip</Text>
            </Pressable>

            <View
              style={{
                marginVertical: 25,
              }}>
              <Text style={styles.headerTxt}>
                Create a unique user name. You can change it anytime.
              </Text>
            </View>
            <Input
              placeholder="Enter a unique username"
              leftIcon={{
                type: 'ionicons',
                name: 'person-outline',
                color: '#222',
                size: 20,
              }}
              errorStyle={{color: authState ? 'green' : 'red', fontSize: 15}}
              errorMessage={usernameErrorMessage}
              renderErrorMessage={renderUsernameErr}
              inputContainerStyle={styles.textInput}
              placeholderTextColor={'#888'}
              inputStyle={{color: '#222', fontSize: 18}}
              defaultValue={username}
              onChangeText={newText => setUsername(newText)}
              containerStyle={{paddingHorizontal: 0}}
            />
            <Button
              title="Continue"
              loading={false}
              loadingProps={{size: 'large', color: 'white'}}
              buttonStyle={{
                backgroundColor: '#5F26A8',
                borderRadius: 10,
              }}
              titleStyle={{fontWeight: '500', fontSize: 23}}
              containerStyle={styles.btn}
              onPress={next}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Username;

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
  skip: {
    fontSize: 20,
    fontWeight: '500',
    color: '#2698C9',
  },
  headerTxt: {
    fontSize: 20,
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',
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
});
