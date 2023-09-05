import React, { createContext, useState } from "react";

interface ModalContextType {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const contectValue = {
    openModal,
    setOpenModal,
  };

	return <ModalContext.Provider value={contectValue}>{children}</ModalContext.Provider>
};
