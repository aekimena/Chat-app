import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Image, useTheme, useThemeMode} from '@rneui/themed';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {useObject, useQuery, useRealm, useUser} from '@realm/react';
import {Messages} from '../Schemas/messageSchema';
import {Conversations} from '../Schemas/conversationsSchema';
import {User} from '../Schemas/userSchema';
import {BSON} from 'realm';
import EmojiPicker from 'rn-emoji-keyboard';
import {launchImageLibrary} from 'react-native-image-picker';
import SendImageModal from '../components/SendImageModal';
import {SelectImg} from '../contexts/selectImgContext';
import storage from '@react-native-firebase/storage';
import LoadingModal from '../components/LoadingModal';
import RenderMessages from '../components/RenderMessages';
import StatusText from '../components/StatusText';
import SendingImg from '../components/SendingImg';

const MessageScreen = () => {
  const realm = useRealm();
  const {theme} = useTheme();
  const {mode} = useThemeMode();
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const route = useRoute();
  const {partnerId} = route.params;
  const user = useUser();
  const userData = useObject(User, BSON.ObjectId.createFromHexString(user?.id));
  const recepientData = useObject(
    User,
    BSON.ObjectId.createFromHexString(partnerId),
  );
  const [inputText, setInputText] = useState('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const focusRef = useRef(null);
  const {modalVisible, setIsModalVisible, setImage, image} =
    useContext(SelectImg);
  const [uploading, setUploading] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedMessages, setselectedMessages] = useState([]);
  const [loadingVisible, setLoadingVisible] = useState(false);
  // const [messages, setMessages] = useState([]);

  const messageSchema = useQuery(Messages);

  const convoSchema = useQuery(Conversations);

  // find conversation that includes the user and the partner
  const convoExists = convoSchema.find(
    obj =>
      obj.members.includes(userData?._id) &&
      obj.members.includes(recepientData?._id) &&
      obj.conversationType === 'partner',
  );

  // check if the partner is typing
  const partnerTyping = convoExists?.membersTyping.includes(recepientData?._id);

  // get messages out of te existing conversation
  const messages = messageSchema.filter(
    item =>
      convoExists?.messages.includes(item._id) &&
      !userData?.deletedMessages.includes(item._id),
  );

  // get the latest update of users, conversations, and messages
  const suscribedUsers = realm.objects(User);
  const suscribedConvos = realm.objects(Conversations);
  const suscribedMessages = realm.objects(Messages);
  const updateSuscription = async () => {
    await realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(suscribedUsers);
      mutableSubs.add(suscribedConvos);
      mutableSubs.add(suscribedMessages);
    });
  };

  useEffect(() => {
    updateSuscription();
  }, [realm, user]);

  // send message if a conversation exists
  const sendMessage = useCallback(
    text => {
      try {
        // create new message
        const newMessage = realm.write(() => {
          return new Messages(realm, {
            _id: new BSON.ObjectID(),
            senderId: BSON.ObjectId.createFromHexString(user?.id),
            recepientId: [recepientData?._id],
            messageType: 'text',
            text: text,
            status: 'sent',
            createdAt: new Date(),
          });
        });

        // push the new message to the conversation
        realm.write(() => {
          convoExists.messages = [...convoExists.messages, newMessage._id];
          convoExists.modifiedAt = new Date();
        });
        onEndEditing();
        console.log('message sent');
        setInputText('');
      } catch (error) {
        console.log(error);
      }
    },
    [realm, user],
  );

  // create a conversation and send message if a conversation doesn't exists
  const createConvo = useCallback(
    text => {
      try {
        // create new message
        const newMessage = realm.write(() => {
          return new Messages(realm, {
            _id: new BSON.ObjectID(),
            senderId: BSON.ObjectId.createFromHexString(user?.id),
            recepientId: [recepientData?._id],
            messageType: 'text',
            text: text,
            status: 'sent',
            createdAt: new Date(),
          });
        });
        // create new conversation
        realm.write(() => {
          return new Conversations(realm, {
            _id: new BSON.ObjectID(),
            conversationType: 'partner',
            members: [userData?._id, recepientData?._id],
            messages: [newMessage._id], // start the conversation with the new message
            createdAt: new Date(),
            modifiedAt: new Date(),
          });
        });
        onEndEditing();
        console.log('convo createdcreated ');
        setInputText('');
      } catch (error) {
        console.log(error);
      }
    },
    [realm, user],
  );

  // send image
  const sendImage = async () => {
    if (image?.uri) {
      // if image uri is gotten
      setIsModalVisible(false);
      setUploading(true);
      try {
        const fileName = image?.uri.substring(image?.uri.lastIndexOf('/') + 1);
        const uploadUri =
          Platform.OS === 'ios'
            ? image?.uri.replace('file://', '')
            : image?.uri;

        const task = storage()
          .ref('chatMedia/' + fileName)
          .putFile(uploadUri); // upload image to firebase storage
        await task;
        const imageUri = await storage()
          .ref('chatMedia/' + fileName)
          .getDownloadURL(); // get the download url

        // create new message
        const newMessage = realm.write(() => {
          return new Messages(realm, {
            _id: new BSON.ObjectID(),
            senderId: BSON.ObjectId.createFromHexString(user?.id),
            recepientId: [recepientData?._id],
            messageType: 'image',
            image: imageUri,
            status: 'sent',
            createdAt: new Date(),
          });
        });
        setUploading(false);
        // if conversation exists
        if (convoExists) {
          realm.write(() => {
            convoExists.messages = [...convoExists.messages, newMessage._id];
            convoExists.modifiedAt = new Date();
          });
        } else {
          // create new conversation
          realm.write(() => {
            return new Conversations(realm, {
              _id: new BSON.ObjectID(),
              conversationType: 'partner',
              members: [userData?._id, recepientData?._id],
              messages: [newMessage._id],
              createdAt: new Date(),
              modifiedAt: new Date(),
            });
          });
        }

        setImage({uri: null, height: null, width: null});
      } catch (error) {
        console.log(error);
        setUploading(false);
      }
    }
  };

  // check if conversation exists or not and use the right function
  function handleSend(inputText) {
    if (convoExists) {
      sendMessage(inputText);
    } else {
      createConvo(inputText);
    }
  }

  // append the selected emoji to the text
  const handlePick = emojiObject => {
    setInputText(inputText + emojiObject.emoji);
  };

  // open the image library
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
          setIsModalVisible(true);
          setLoadingVisible(false);
        }
      })
      .catch(error => {
        console.log(error);
        setLoadingVisible(false);
      });
  };

  // set all messages seen

  const seenMessages = messages?.map(item => {
    if (item.senderId.toHexString() !== user?.id) {
      if (item.status !== 'seen') {
        realm.write(() => {
          item.status = 'seen';
        });
      }
    }
  });

  useFocusEffect(
    React.useCallback(() => {
      if (seenMessages) {
        null;
      }
    }, []),
  );

  // delete the selected messages for both users
  const delForAll = () => {
    try {
      if (convoExists) {
        selectedMessages.map(item => {
          realm.write(() => {
            convoExists.messages = convoExists.messages.filter(
              ids => ids.toHexString() !== item,
            );
          });
        });
      }
      console.log('done');
      setSelectMode(false);
      setselectedMessages([]);
    } catch (error) {
      console.log(error);
    }
  };
  // delete selected messages for the user
  const delForMe = () => {
    try {
      if (userData) {
        selectedMessages.map(item => {
          realm.write(() => {
            userData.deletedMessages = [
              ...userData.deletedMessages,
              BSON.ObjectId.createFromHexString(item),
            ];
          });
        });
        console.log('done');
        setSelectMode(false);
        setselectedMessages([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showALlert = () => {
    Alert.alert(
      '',
      'Delete selected Messages',
      [
        {
          text: 'Delete for everyone',
          onPress: delForAll,
        },
        {
          text: 'Delete for me',
          onPress: delForMe,
        },
      ],
      {cancelable: true},
    );
  };

  // function called when the user starts typing
  function onTextChange() {
    if (convoExists) {
      if (convoExists?.membersTyping.includes(userData?._id)) {
        null;
      } else {
        realm.write(() => {
          convoExists.membersTyping = [
            ...convoExists?.membersTyping,
            userData?._id,
          ];
        });
        console.log("you're typing");
      }
    }
  }

  // function called when user stops typing
  function onEndEditing() {
    if (convoExists) {
      if (!convoExists?.membersTyping.includes(userData?._id)) {
        null;
      } else {
        realm.write(() => {
          convoExists.membersTyping = convoExists?.membersTyping.filter(
            ids => ids.toHexString() !== userData?._id.toHexString(),
          );
        });
        console.log('you stopped typing');
      }
    }
  }

  // set the user typing to false when the user exists the screen
  useEffect(() => {
    return () => {
      onEndEditing();
    };
  }, []);

  return (
    <SafeAreaProvider
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      <SendImageModal
        modalVisible={modalVisible}
        setIsModalVisible={setIsModalVisible}
        sendImage={sendImage}
        mode={mode}
        username={recepientData?.username}
      />
      <View style={styles.header}>
        {selectMode ? (
          <>
            <Pressable
              onPress={() => {
                setselectedMessages([]);
                setSelectMode(false);
              }}>
              <IonIcons name="close" size={30} color={theme.colors.textColor} />
            </Pressable>

            <View style={[styles.flexRow, {gap: 30}]}>
              <Text
                style={{
                  color: theme.colors.textColor,
                  fontSize: 20,
                  fontWeight: '500',
                }}>
                {selectedMessages.length}
              </Text>
              <Pressable>
                <Icon name="reply" size={20} color={theme.colors.textColor} />
              </Pressable>
              <Pressable>
                <IonIcons
                  name="copy"
                  size={20}
                  color={theme.colors.textColor}
                />
              </Pressable>
              <Pressable onPress={showALlert}>
                <IonIcons
                  name="trash-bin"
                  size={20}
                  color={theme.colors.textColor}
                />
              </Pressable>
              <Pressable>
                <Icon name="share" size={20} color={theme.colors.textColor} />
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <View style={styles.flexRow}>
              <Pressable onPress={() => navigation.goBack()}>
                <IonIcons
                  name="arrow-back-outline"
                  size={25}
                  color={theme.colors.textColor}
                />
              </Pressable>

              <View style={styles.flexRow}>
                <Pressable
                  onPress={() =>
                    navigation.navigate('userProfile-screen', {
                      partnerId: recepientData?._id,
                    })
                  }>
                  <Image
                    source={
                      recepientData?.profileImage == ''
                        ? require('../images/placeholder-img.jpg')
                        : {uri: recepientData?.profileImage}
                    }
                    resizeMode="cover"
                    style={styles.displayImg}
                  />
                </Pressable>

                <View style={{gap: 2}}>
                  <Text
                    style={{
                      color: theme.colors.textColor,
                      fontSize: 18,
                    }}>
                    {recepientData?.username}
                  </Text>
                  <StatusText
                    partnerTyping={partnerTyping}
                    isOnline={recepientData?.isOnline}
                    lastSeen={recepientData?.lastSeen}
                  />
                </View>
              </View>
            </View>

            <Pressable>
              <IonIcons
                name="ellipsis-horizontal"
                size={25}
                color={theme.colors.textColor}
              />
            </Pressable>
          </>
        )}
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: mode == 'dark' ? theme.colors.background : '#f8f8f8',
          paddingHorizontal: 15,
        }}>
        <FlatList
          ref={flatListRef}
          data={messages.reverse()}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={item => (
            <RenderMessages
              {...item}
              arr={selectedMessages}
              selectMode={selectMode}
              setSelectMode={setSelectMode}
              setArr={setselectedMessages}
              userData={userData}
            />
          )}
          inverted
          ListHeaderComponent={uploading && <SendingImg />}
        />
      </View>

      <View style={styles.textInputArea}>
        <Pressable
          onPress={() => setEmojiPickerOpen(true)}
          style={[
            styles.emojiBtn,
            {
              backgroundColor: mode == 'dark' ? '#333' : '#f8f8f8',
            },
          ]}>
          <IonIcons
            name="happy-outline"
            size={25}
            color={theme.colors.textColor}
          />
        </Pressable>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: theme.colors.textColor,
              color: theme.colors.textColor,
            },
          ]}
          ref={focusRef}
          placeholder="Type here"
          placeholderTextColor={'#999'}
          defaultValue={inputText}
          onChangeText={newtext => setInputText(newtext)}
          multiline
          onChange={onTextChange}
          onEndEditing={onEndEditing}
        />
        <View
          style={[
            styles.camMicSendBtn,
            {
              backgroundColor: mode == 'dark' ? '#333' : '#f8f8f8',
              width: inputText == '' ? 'auto' : 55,
              borderRadius: inputText == '' ? 17 : 27.5,
            },
          ]}>
          {inputText == '' ? (
            <>
              <Pressable onPress={openImageLibrary}>
                <IonIcons
                  name="camera-outline"
                  size={25}
                  color={theme.colors.textColor}
                />
              </Pressable>
              <Pressable>
                <IonIcons
                  name="mic-outline"
                  size={25}
                  color={theme.colors.textColor}
                />
              </Pressable>
            </>
          ) : (
            <Pressable onPress={() => handleSend(inputText)}>
              <IonIcons name="send" size={25} color={theme.colors.textColor} />
            </Pressable>
          )}
        </View>
      </View>
      <EmojiPicker
        onEmojiSelected={handlePick}
        open={emojiPickerOpen}
        onClose={() => setEmojiPickerOpen(false)}
        theme={{
          container: theme.colors.background,
          header: theme.colors.textColor,
        }}
      />
      <LoadingModal
        isVisible={loadingVisible}
        setIsVisible={setLoadingVisible}
      />
    </SafeAreaProvider>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  header: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  displayImg: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  flexRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
  flexStyle: {
    flex: 1,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '400',
  },

  textInputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 15,
  },
  emojiBtn: {
    height: 55,
    width: 55,
    paddingHorizontal: 10,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    minHeight: 55,
    maxHeight: 200,
    flex: 1,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 20,
  },
  camMicSendBtn: {
    height: 55,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
  },
});
