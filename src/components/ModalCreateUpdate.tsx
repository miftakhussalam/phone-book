/** @jsxImportSource @emotion/react */
import React, { ChangeEvent, useState } from "react";
import { css } from "@emotion/react";
import { theme } from "../theme/theme";
import { PhoneModel } from "../graphql/models";
import { Icon } from "@iconify/react";
import { gql, useMutation } from "@apollo/client";
import { ADD_CONTACT_WITH_PHONES } from "../graphql/mutations";
import { GET_CONTACT_LIST } from "../graphql/queries";

interface ModalCreateUpdateProps {
  openModal?: boolean;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

const styles = {
  displayNone: css({
    display: "none",
    transition: "all 0.5s ease-out",
  }),
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
    marginLeft: '10px',
    cursor: 'pointer',
  }),
  containerConfirmBtn: css({
    display: "flex",
    justifyContent: "right",
    alignItems: "center",
    width: "100%",
  }),
  confirmBtn: css({
    cursor: 'pointer',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px",
    borderWidth: 0,
    borderRadius: "5px",
    color: theme.colors.text.light,
    gap: 5,
    padding: '5px'
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
}: ModalCreateUpdateProps) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phones, setPhones] = useState<PhoneModel[]>([{ number: "" }]);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const updatedPhones = [...phones];
    updatedPhones[i] = { number: e.target.value };
    setPhones(updatedPhones);
  };

  const removePhone = (indexToRemove: number) => {
    const updatedPhones = [...phones];
    updatedPhones.splice(indexToRemove, 1);
    setPhones(updatedPhones);
  };

  const [addContact, { data, loading, error }] = useMutation(
    ADD_CONTACT_WITH_PHONES,
    {
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
    }
  );

  const closeModal = () => {
    if (setOpenModal) {
      setOpenModal(false);
    }
  };

  const submitData = () => {
    addContact({
      variables: {
        first_name: firstName,
        last_name: lastName,
        phones,
      },
    })
      .then((data) => {
        closeModal();
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  console.log('data:', data);

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
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="your first name..."
          />
        </div>
        <div css={styles.inputForm}>
          <label css={styles.label}>Last Name:</label>
          <input
            css={styles.input}
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="your last name..."
          />
        </div>
        <div css={styles.inputPhone}>
          <label css={styles.label}>Phones:</label>
          {phones.map((item, index) => (
            <div css={styles.phoneNumber} key={index}>
              <input
                css={styles.input}
                type="number"
                value={item.number}
                onChange={(e) => handlePhoneChange(e, index)}
                placeholder="your phone number..."
              />
              {phones.length - index === 1 ? (
                <div
                  css={styles.moreBtn}
                  onClick={() => setPhones([...phones, { number: "" }])}
                >
                  <Icon
                    icon="zondicons:add-outline"
                    color={theme.colors.primary}
                    height={20}
                    width={20}
                  />
                </div>
              ) : (
                <div css={styles.moreBtn} onClick={() => removePhone(index)}>
                  <Icon
                    icon="mdi:trash-outline"
                    color={theme.colors.primary}
                    height={20}
                    width={20}
                  />
                </div>
              )}
            </div>
          ))}
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
