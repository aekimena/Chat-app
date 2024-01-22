import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useTheme} from '@rneui/themed';
import {useObject, useQuery, useRealm, useUser} from '@realm/react';
import {useFocusEffect} from '@react-navigation/native';
import {User} from '../Schemas/userSchema';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Conversations} from '../Schemas/conversationsSchema';
import {Messages} from '../Schemas/messageSchema';
import {BSON} from 'realm';
import {OnlineStatusContext} from '../contexts/OnlineStatusContext';
import {FocusedScreen} from '../contexts/focusedScreenContext';
import RenderChatList from '../components/RenderChatList';

const RenderEmptyConvos = () => {
  const {theme} = useTheme();
  return (
    <View style={styles.flex1JusAli}>
      <Text
        style={{
          color: theme.colors.textColor,
          fontSize: 18,
        }}>
        Your conversations will show here
      </Text>
    </View>
  );
};

const Chats = () => {
  const {theme} = useTheme();
  const realm = useRealm();

  const user = useUser();
  // get all conversations that includes user
  const convoSchema = useQuery(Conversations)
    .sorted('modifiedAt', true)
    .filter(obj =>
      obj.members.includes(BSON.ObjectId.createFromHexString(user?.id)),
    );

  const userData = useObject(User, BSON.ObjectId.createFromHexString(user?.id));

  const messages = useQuery(Messages).filter(
    obj => obj.recepientId.includes(userData?._id) && obj.status == 'sent',
  );
  const {checkOnlineStatus} = useContext(OnlineStatusContext);
  const {setFocusedScreen} = useContext(FocusedScreen);
  const [convos, setConvos] = useState([]);

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

  useFocusEffect(
    React.useCallback(() => {
      setFocusedScreen(1);
    }, []),
  );

  useEffect(() => {
    checkOnlineStatus();
    setConvos(convoSchema);
  }, []);

  const deliveredMessages = messages.map(item => {
    if (item.status !== 'seen') {
      realm.write(() => {
        item.status = 'delivered';
      });
    }
  });

  useFocusEffect(
    React.useCallback(() => {
      if (deliveredMessages) {
        null;
      }
    }, []),
  );

  return (
    <SafeAreaView style={{backgroundColor: theme.colors.background, flex: 1}}>
      <View style={styles.header}>
        <Text
          style={{
            fontSize: 35,
            fontWeight: '500',
            color: theme.colors.textColor,
          }}>
          Chats
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
          <IonIcons
            name="create-outline"
            color={theme.colors.textColor}
            size={25}
          />
          <IonIcons
            name="camera-outline"
            color={theme.colors.textColor}
            size={25}
          />
          <IonIcons
            name="search-outline"
            color={theme.colors.textColor}
            size={25}
          />
        </View>
      </View>
      <View style={{marginTop: 20, flex: 1}}>
        <FlatList
          data={convos}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={item => <RenderChatList {...item} />}
          contentContainerStyle={styles.flatList}
          ListEmptyComponent={<RenderEmptyConvos />}
        />
      </View>
    </SafeAreaView>
  );
};

export default Chats;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 15,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flex1JusAli: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  flatList: {
    gap: 15,
    paddingBottom: 200,
    flex: 1,
  },
});
