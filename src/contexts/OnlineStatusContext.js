import React, {useEffect, useState} from 'react';
import {BSON} from 'realm';
import {User} from '../Schemas/userSchema';
import {addEventListener} from '@react-native-community/netinfo';
import {useObject, useQuery, useRealm, useUser} from '@realm/react';
import {Messages} from '../Schemas/messageSchema';

export const OnlineStatusContext = React.createContext();

const OnlineStatusProvider = ({children}) => {
  const realm = useRealm();
  const user = useUser();

  const userData = useObject(User, BSON.ObjectId.createFromHexString(user?.id));
  const [userIsOnline, setUserIsOnline] = useState(false);
  // get all messages with status: 'sent'
  const messages = useQuery(Messages).filter(
    obj => obj.recepientId.includes(userData?._id) && obj.status == 'sent',
  );

  // check if user is connected to the internet and then set all sent messages to delivered
  function checkOnlineStatus() {
    const unsubscribe = addEventListener(state => {
      setUserIsOnline(state.isConnected && state.isInternetReachable);
      if (state.isConnected && state.isInternetReachable) {
        try {
          realm.write(() => {
            userData.isOnline = true;
          });
          messages.map(item => {
            if (item.status !== 'seen') {
              realm.write(() => {
                item.status = 'delivered';
              });
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
    unsubscribe();
  }

  return (
    <OnlineStatusContext.Provider
      value={{
        userIsOnline,
        checkOnlineStatus,
      }}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export default OnlineStatusProvider;
