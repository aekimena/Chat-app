import React, {useState} from 'react';

export const FocusedScreen = React.createContext();

const FocusedScreenProvider = ({children}) => {
  const [focusedScreen, setFocusedScreen] = useState(1); // focused screen is set to the first page

  return (
    <FocusedScreen.Provider
      value={{
        focusedScreen,
        setFocusedScreen,
      }}>
      {children}
    </FocusedScreen.Provider>
  );
};

export default FocusedScreenProvider;
