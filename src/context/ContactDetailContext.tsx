import React, { createContext, useState } from "react";
import { ContactModel } from "../graphql/models";

interface ContactDetailContextType {
  contactDetail: ContactModel;
  setContactDetail: React.Dispatch<React.SetStateAction<ContactModel>>;
}

export const ContactDetailContext = createContext<
  ContactDetailContextType | undefined
>(undefined);

interface ContactDetailProviderProps {
  children: React.ReactNode;
}
export const defaultContactDetail: ContactModel = {
	id: 0,
	first_name: "",
	last_name: "",
	created_at: "",
	phones: [
		{
			number: "",
		},
	],
};

export const ContactDetailProvider: React.FC<ContactDetailProviderProps> = ({
  children,
}) => {
  
  const [contactDetail, setContactDetail] =
    useState<ContactModel>(defaultContactDetail);

  const contextValue = {
    contactDetail,
    setContactDetail,
  };

  return (
    <ContactDetailContext.Provider value={contextValue}>
      {children}
    </ContactDetailContext.Provider>
  );
};
