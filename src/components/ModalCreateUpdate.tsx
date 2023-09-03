/** @jsxImportSource @emotion/react */
import React, { ChangeEvent, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { theme } from "../theme/theme";
import { ContactModel, PhoneModel } from "../graphql/models";
import { Icon } from "@iconify/react";
import { gql, useMutation } from "@apollo/client";
import {
  ADD_CONTACT_WITH_PHONES,
  ADD_NUMBER_TO_CONTACT,
  EDIT_CONTACT_BY_ID,
  EDIT_PHONE_NUMBER,
} from "../graphql/mutations";
// import { GET_CONTACT_LIST } from "../graphql/queries";

interface ModalCreateUpdateProps {
  openModal?: boolean;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
  contactDetail?: ContactModel;
  setContactDetail?: React.Dispatch<React.SetStateAction<ContactModel>>;
  type: string;
}

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    width: "100%",
    height: "100%",
    background: theme.colors.background.transparent,
    transition: "all 0.5s ease",
  }),
  wrap: css({
    position: "absolute",
    padding: 0,
    right: 0,
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  }),
  container: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    background: theme.colors.background.main,
    borderRadius: "10px",
    padding: "10px",
    zIndex: 2,
    width: "80%",
  }),
  inputForm: css({
    display: "flex",
    flexDirection: "column",
    width: "80%",
    margin: "5px 0",
  }),
  inputPhone: css({
    display: "flex",
    flexDirection: "column",
    width: "80%",
    margin: "5px 0",
  }),
  phoneNumber: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5px 0",
  }),
  closeBtn: css({
    background: theme.colors.primary,
    cursor: "pointer",
  }),
  label: css({
    color: theme.colors.primary,
  }),
  input: css({
    padding: 5,
    // textAlign: "center",
    borderColor: theme.colors.primary,
    border: "none",
    borderRadius: "10px",
    boxShadow: "0px 1px 5px 0px rgba(0,0,0,0.3)",
    ":focus": {
      borderColor: theme.colors.secondary,
      outlineWidth: 1,
      outlineColor: theme.colors.primary,
    },
    "::placeholder": {
      color: theme.colors.text.dark,
    },
    width: "100%",
  }),
  moreBtn: css({
    display: "flex",
    justifyContent: "right",
    alignItems: "center",
    cursor: "pointer",
    alignSelf: "self-end",
    color: theme.colors.primary,
    gap: 10,
    // transition: "all 0.3s ease",
    ':hover': {
      fontWeight: "bolder",
      transition: "all 0.3s ease",
    }
  }),
  actionBtn: css({
    display: "flex",
    justifyContent: "right",
    alignItems: "center",
    marginLeft: "10px",
    cursor: "pointer",
  }),
  containerConfirmBtn: css({
    display: "flex",
    justifyContent: "right",
    alignItems: "center",
    width: "100%",
  }),
  confirmBtn: css({
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px",
    borderWidth: 0,
    borderRadius: "5px",
    color: theme.colors.text.light,
    gap: 5,
    padding: "5px",
  }),
  modalOpen: css({
    opacity: 1,
    pointerEvents: "auto",
    transform: "translateY(0%)",
  }),
  modalClosed: css({
    opacity: 0,
    pointerEvents: "none",
    transform: "translateY(-100%)",
  }),
};

const ModalCreateUpdate: React.FC<ModalCreateUpdateProps> = ({
  openModal,
  setOpenModal,
  contactDetail,
  setContactDetail,
  type,
}: ModalCreateUpdateProps) => {
  const [firstName, setFirstName] = useState<string>(
    contactDetail?.first_name || ""
  );
  const [lastName, setLastName] = useState<string>(
    contactDetail?.last_name || ""
  );
  const [phones, setPhones] = useState<PhoneModel[]>(
    contactDetail?.phones || [{ number: "" }]
  );

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const updatedPhones = [...phones];
    const inputValue = e.target.value;
    updatedPhones[i] = { number: inputValue.replace(/[^0-9+]/g, '') };
    setPhones(updatedPhones);
  };

  const removePhone = (indexToRemove: number) => {
    const updatedPhones = [...phones];
    updatedPhones.splice(indexToRemove, 1);
    setPhones(updatedPhones);
  };

  const [addContact] = useMutation(ADD_CONTACT_WITH_PHONES, {
    update(cache, { data: addContact }) {
      cache.modify({
        fields: {
          contact(existingContact = []) {
            const newContactRef = cache.writeFragment({
              data: addContact.insert_contact.returning[0],
              fragment: gql`
                fragment AddContactWithPhones on contact {
                  first_name
                  last_name
                  id
                  phones {
                    number
                  }
                }
              `,
            });
            return [...existingContact, newContactRef];
          },
        },
      });
    },
    // refetchQueries: [{ query: GET_CONTACT_LIST }],
  });

  const [editContact] = useMutation(EDIT_CONTACT_BY_ID, {
    update(cache, { data: editContact }) {
      cache.modify({
        fields: {
          contact(existingContact = []) {
            const newContactRef = cache.writeFragment({
              data: editContact.update_contact_by_pk,
              fragment: gql`
                fragment EditContactWithPhones on contact {
                  first_name
                  last_name
                  id
                  phones {
                    number
                  }
                }
              `,
            });
            return [...existingContact, newContactRef];
          },
        },
      });
    },
    // refetchQueries: [{ query: GET_CONTACT_LIST }],
  });

  const [addNumberToContact] = useMutation(ADD_NUMBER_TO_CONTACT, {
    update(cache, { data: addNumberToContact }) {
      cache.modify({
        fields: {
          contact(existingContact = []) {
            const newContactRef = cache.writeFragment({
              data: addNumberToContact.insert_phone.returning[0].contact,
              fragment: gql`
                fragment AddNumberToContact on contact {
                  first_name
                  last_name
                  id
                  phones {
                    number
                  }
                }
              `,
            });
            return [...existingContact, newContactRef];
          },
        },
      });
    },
    // refetchQueries: [{ query: GET_CONTACT_LIST }],
  });

  const [editPhoneNumber] = useMutation(EDIT_PHONE_NUMBER, {
    update(cache, { data: editPhoneNumber }) {
      cache.modify({
        fields: {
          contact(existingPhoneNumber = []) {
            const newPhoneNumberRef = cache.writeFragment({
              data: editPhoneNumber.update_phone_by_pk.contact,
              fragment: gql`
                fragment EditPhoneNumberWithPhones on contact {
                  first_name
                  last_name
                  id
                  phones {
                    number
                  }
                }
              `,
            });
            return [...existingPhoneNumber, newPhoneNumberRef];
          },
        },
      });
    },
  });

  const closeModal = () => {
    if (setOpenModal) {
      setOpenModal(false);
    }
  };

  const addEditPhoneNumber = (phone: PhoneModel, index: number) => {
    if (index >= (contactDetail?.phones.length || 0)) {
      addNumberToContact({
        variables: {
          contact_id: contactDetail?.id,
          phone_number: phones[index].number,
        },
      })
        .then((res) => {
          alert("add number success");
          if (setContactDetail)
            setContactDetail(res.data.insert_phone.returning[0].contact);
        })
        .catch((err) => alert(err));
    } else {
      editPhoneNumber({
        variables: {
          pk_columns: {
            number: phone.number,
            contact_id: contactDetail?.id,
          },
          new_phone_number: phones[index].number,
        },
      })
        .then((res) => {
          alert("update success");
          if (setContactDetail)
            setContactDetail(res.data.update_phone_by_pk.contact);
        })
        .catch((err) => alert(err));
    }
  };

  const submitData = () => {
    if (type === "add") {
      addContact({
        variables: {
          first_name: firstName,
          last_name: lastName,
          phones,
        },
      })
        .then((res) => {
          closeModal();
          alert("add contact success");
        })
        .catch((err) => alert(err));
    } else {
      editContact({
        variables: {
          id: contactDetail?.id,
          _set: {
            first_name: firstName,
            last_name: lastName,
            // phones,
          },
        },
      })
        .then((res) => {
          closeModal();
          if (setContactDetail) setContactDetail(res.data.update_contact_by_pk);
        })
        .catch((err) => alert(err));
    }
  };

  useEffect(() => {
    setFirstName(contactDetail?.first_name || "");
    setLastName(contactDetail?.last_name || "");
    setPhones(contactDetail?.phones || [{ number: "" }]);
  }, [contactDetail]);
  return (
    <div
      css={[styles.root, !openModal ? styles.modalClosed : styles.modalOpen]}
    >
      <div css={openModal ? styles.wrap : {}} onClick={closeModal}></div>
      <div css={styles.container}>
        <div css={styles.inputForm}>
          <label css={styles.label}>First Name:</label>
          <input
            css={styles.input}
            type="text"
            value={firstName}
            onChange={(e) => {
              if (/^[a-zA-Z0-9\s]+$/.test(e.target.value)) {
                setFirstName(e.target.value);
              } else if (e.target.value === "") {
                setFirstName("");
              }
            }}
            placeholder="your first name..."
          />
        </div>
        <div css={styles.inputForm}>
          <label css={styles.label}>Last Name:</label>
          <input
            css={styles.input}
            type="text"
            value={lastName}
            onChange={(e) => {
              if (/^[a-zA-Z0-9\s]+$/.test(e.target.value)) {
                setLastName(e.target.value);
              } else if (e.target.value === "") {
                setLastName("");
              }
            }}
            placeholder="your last name..."
          />
        </div>
        <div css={styles.inputPhone}>
          <label css={styles.label}>Phones:</label>
          {phones.map((item, index) => (
            <div css={styles.phoneNumber} key={index}>
              <input
                css={styles.input}
                pattern="[0-9\+]+"
                title="Phone Number (Format: +99(99)9999-9999)"
                value={item.number}
                onChange={(e) => handlePhoneChange(e, index)}
                placeholder="your phone number..."
                required
              />
              {type === "add" ? (
                index > 0 && (
                  <div css={styles.actionBtn} onClick={() => removePhone(index)}>
                    <Icon
                      icon="mdi:trash-outline"
                      color={theme.colors.primary}
                      height={20}
                      width={20}
                    />
                  </div>
                )
              ) : (
                <div
                  css={styles.actionBtn}
                  onClick={() =>
                    addEditPhoneNumber(
                      contactDetail?.phones[index] || { number: "" },
                      index
                    )
                  }
                >
                  <Icon
                    icon="material-symbols:save-outline"
                    color={theme.colors.primary}
                    height={20}
                    width={20}
                  />
                </div>
              )}
            </div>
          ))}
          <div
            css={styles.moreBtn}
            onClick={() => setPhones([...phones, { number: "" }])}
          >
            <p>add more</p>
            <Icon
              icon="zondicons:add-outline"
              color={theme.colors.primary}
              height={20}
              width={20}
            />
          </div>
        </div>
        <div css={styles.containerConfirmBtn}>
          <button
            css={[styles.confirmBtn, { background: theme.colors.error }]}
            onClick={closeModal}
          >
            Cancel
            <Icon
              icon="material-symbols:cancel-outline"
              color={theme.colors.text.light}
              height={20}
              width={20}
            />
          </button>
          <button
            css={[styles.confirmBtn, { background: theme.colors.primary }]}
            onClick={submitData}
          >
            Save
            <Icon
              icon="material-symbols:save-outline"
              color={theme.colors.text.light}
              height={20}
              width={20}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateUpdate;
