import React, {useState} from 'react';

export const SelectImg = React.createContext();

const SelectImgProvider = ({children}) => {
  const [modalVisible, setIsModalVisible] = useState(false);
  const [addNewPicModal, setAddNewPicModal] = useState(false);
  const [image, setImage] = useState({height: null, width: null, uri: null});

  return (
    <SelectImg.Provider
      value={{
        modalVisible,
        setIsModalVisible,
        setAddNewPicModal,
        addNewPicModal,
        image,
        setImage,
      }}>
      {children}
    </SelectImg.Provider>
  );
};

export default SelectImgProvider;
