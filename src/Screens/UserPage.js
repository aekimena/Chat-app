import {
  Alert,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useTheme, useThemeMode} from '@rneui/themed';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useApp, useObject, useQuery, useRealm, useUser} from '@realm/react';
import {User} from '../Schemas/userSchema';
import {FocusedScreen} from '../contexts/focusedScreenContext';
import EditPicture from '../components/EditPictureModal';
import {launchImageLibrary} from 'react-native-image-picker';
import {SelectImg} from '../contexts/selectImgContext';
import SendImageModal from '../components/SendImageModal';
import AddNewPictureModal from '../components/AddNewPictureModal';
import storage from '@react-native-firebase/storage';
import {BSON} from 'realm';
import UpdateUsernameModal from '../components/UpdateUsernameModal';
import LoadingModal from '../components/LoadingModal';

const Seperator = () => {
  const {theme} = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.textColor,
        height: 0.3,
        width: '100%',
        alignSelf: 'center',
      }}></View>
  );
};

const UserPage = () => {
  const navigation = useNavigation();
  const user = useUser();
  const realm = useRealm();
  const userSchema = useQuery(User);
  const {theme} = useTheme();
  const {mode} = useThemeMode();
  const app = useApp();
  const {setFocusedScreen} = useContext(FocusedScreen);
  const [isModalVisible, setModalVisible] = useState(false);
  const {setImage, image, setAddNewPicModal, addNewPicModal} =
    useContext(SelectImg);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [isUsernameModalShown, setIsUsernameModalShown] = useState(false);
  const [inputText, setInputText] = useState('');
  const [usernameExists, setUsernameExists] = useState(false);
  const [infoColor, setInfoColor] = useState('green');
  const userData = useObject(User, BSON.ObjectId.createFromHexString(user?.id));

  useFocusEffect(
    React.useCallback(() => {
      setFocusedScreen(4);
    }, []),
  );

  // get latest updates of all users
  const suscribedItems = realm.objects(User);
  const updateSuscription = async () => {
    await realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(suscribedItems);
    });
  };
  useEffect(() => {
    updateSuscription();
  }, [realm, user]);

  // open image library
  const openImageLibrary = () => {
    setLoadingVisible(true);
    launchImageLibrary({
      mediaType: 'photo',
      maxHeight: 500,
      maxWidth: 500,
      quality: 0.5,
    })
      .then(response => {
        if (response.assets[0].uri) {
          setImage({
            uri: response.assets[0].uri,
            height: response.assets[0].height,
            width: response.assets[0].width,
          });
          console.log(response.assets[0].uri);
          setAddNewPicModal(true);
          setLoadingVisible(false);
        }
      })
      .catch(error => {
        console.log(error);
        setLoadingVisible(false);
      });
  };

  // function to update profile image
  const updateImage = async () => {
    if (image?.uri) {
      try {
        setAddNewPicModal(false);
        setLoadingVisible(true);
        const fileName = image?.uri.substring(image?.uri.lastIndexOf('/') + 1);
        const uploadUri =
          Platform.OS === 'ios'
            ? image?.uri.replace('file://', '')
            : image?.uri;

        const task = storage()
          .ref('profileImages/' + fileName)
          .putFile(uploadUri);
        await task;
        const imageUri = await storage()
          .ref('profileImages/' + fileName)
          .getDownloadURL();
        realm.write(() => {
          userData.profileImage = imageUri;
        });

        setImage({uri: null, height: null, width: null});
        setLoadingVisible(false);
      } catch (error) {
        console.log(error);
        setLoadingVisible(false);
      }
    }
  };

  // function to update username
  const updateUsername = () => {
    setIsUsernameModalShown(false);
    setLoadingVisible(true);
    try {
      realm.write(() => {
        userData.username = inputText;
      });
      setLoadingVisible(false);
      setInputText('');
      setUsernameExists(false);
    } catch (error) {
      console.log(error);
      setLoadingVisible(false);
    }
  };

  // check if username is taken
  const checkUsernameExists = text => {
    setInputText(text);
    const usernameExists = userSchema.find(obj => obj.username == text);
    if (usernameExists) {
      setInfoColor('red');
      setUsernameExists(true);
    } else {
      setInfoColor('green');
      setUsernameExists(false);
    }
  };

  // logout user
  async function logOutUser() {
    try {
      setLoadingVisible(true);
      await app.removeUser(user);
      setLoadingVisible(false);
    } catch (error) {
      console.log(error);
      setLoadingVisible(false);
    }
  }

  const showAlert = () => {
    Alert.alert(
      'Log Out',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          onPress: logOutUser,
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      <View style={styles.headers}>
        <Pressable onPress={() => navigation.goBack()}>
          <IonIcons
            name="arrow-back-outline"
            size={25}
            color={theme.colors.textColor}
          />
        </Pressable>
        <Pressable>
          <IonIcons
            name="ellipsis-horizontal"
            size={25}
            color={theme.colors.textColor}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{marginTop: 15}}>
        <View style={{gap: 15, alignItems: 'center', paddingHorizontal: 15}}>
          <Pressable onPress={() => setModalVisible(true)}>
            <Image
              source={
                userData?.profileImage == ''
                  ? require('../images/placeholder-img.jpg')
                  : {uri: userData?.profileImage}
              }
              style={styles.profileImage}
              resizeMode="cover"
            />
          </Pressable>

          <View style={styles.usernameCont}>
            <Text
              style={[
                styles.username,
                {
                  color: theme.colors.textColor,
                },
              ]}>
              @{userData?.username}
            </Text>
            <Pressable onPress={() => setIsUsernameModalShown(true)}>
              <FontAwesome
                name="pen"
                size={15}
                color={theme.colors.textColor}
              />
            </Pressable>
          </View>

          <View style={styles.followCont}>
            <View style={{alignItems: 'center'}}>
              <Text
                style={[
                  styles.followNum,
                  {
                    color: theme.colors.textColor,
                  },
                ]}>
                {userData?.followers?.length}
              </Text>
              <Text style={styles.followTxt}>Followers</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text
                style={[
                  styles.followNum,
                  {
                    color: theme.colors.textColor,
                  },
                ]}>
                {userData?.following?.length}
              </Text>
              <Text style={styles.followTxt}>Following</Text>
            </View>
          </View>

          <View style={styles.flexRow}>
            <Pressable
              style={[
                styles.share_edit_btn,
                {backgroundColor: mode == 'dark' ? '#222' : '#f8f8f8'},
              ]}>
              <Text
                style={{
                  color: theme.colors.textColor,
                  fontSize: 20,
                }}>
                Edit profile
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.share_edit_btn,
                {backgroundColor: mode == 'dark' ? '#222' : '#f8f8f8'},
              ]}>
              <Text
                style={{
                  color: theme.colors.textColor,
                  fontSize: 20,
                }}>
                Share profile
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={{gap: 0, marginTop: 20}}>
          <View style={styles.settings}>
            <Text style={{fontSize: 20, color: theme.colors.textColor}}>
              Theme
            </Text>
            <FontAwesome name="pen" color={theme.colors.textColor} size={18} />
          </View>
          <Seperator />
          <View style={styles.settings}>
            <Text style={{fontSize: 20, color: theme.colors.textColor}}>
              Bio
            </Text>
            <FontAwesome name="pen" color={theme.colors.textColor} size={18} />
          </View>
          <Seperator />
          <Pressable
            onPress={showAlert}
            style={({pressed}) => [
              styles.settings,
              {
                backgroundColor: pressed
                  ? mode == 'dark'
                    ? '#333'
                    : '#f8f8f8'
                  : 'transparent',
              },
            ]}>
            <Text style={{fontSize: 20, color: theme.colors.textColor}}>
              Log Out
            </Text>
            <FontAwesome
              name="arrow-right-from-bracket"
              color={theme.colors.textColor}
              size={18}
            />
          </Pressable>
        </View>
      </ScrollView>
      <EditPicture
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        openLibrary={openImageLibrary}
      />
      <AddNewPictureModal
        modal={addNewPicModal}
        setModal={setAddNewPicModal}
        sendImage={updateImage}
      />
      <UpdateUsernameModal
        checkFunc={checkUsernameExists}
        setFunc={updateUsername}
        setInputText={setInputText}
        infoColor={infoColor}
        isModalShown={isUsernameModalShown}
        setIsModalShown={setIsUsernameModalShown}
        usernameExists={usernameExists}
        inputText={inputText}
      />
      <LoadingModal
        isVisible={loadingVisible}
        setIsVisible={setLoadingVisible}
      />
    </SafeAreaView>
  );
};

export default UserPage;

const styles = StyleSheet.create({
  profileImage: {
    height: 170,
    width: 170,
    borderRadius: 85,
  },
  share_edit_btn: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 10,
  },
  headers: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  usernameCont: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    flexDirection: 'row',
  },
  username: {
    fontSize: 20,
    fontWeight: '500',
  },
  followCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  followNum: {
    fontWeight: '500',
    fontSize: 20,
  },
  followTxt: {
    color: '#999',
    fontWeight: '400',
    fontSize: 16,
  },
  flexRow: {flexDirection: 'row', alignItems: 'center', gap: 20},
  settings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
});
