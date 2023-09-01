/** @jsxImportSource @emotion/react */
import React from "react";
import { useLocation } from "react-router-dom";
import { css } from "@emotion/react";
import { Icon } from "@iconify/react";
import { ContactModel } from "../graphql/models";
import Navbar from "../components/Navbar";
import { theme } from "../theme/theme";

interface ContactDetailProps {}

const styles = {
  container: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
  }),
  contactName: css({
    fontSize: 16,
    fontWeight: "bolder",
    textAlign: "center",
    color: theme.colors.primary,
  }),
  actions: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: "10px",
  }),
  actionIcon: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }),
  actionText: css({
    margin: 0,
  }),
  listNumber: css({
    display: "flex",
    alignItems: "center",
  }),
  number: css({
    margin: 0,
    fontSize: 16,
    fontWeight: "bolder",
    color: theme.colors.text.main,
  }),
};

const ContactDetailPage: React.FC<ContactDetailProps> = (
  props: ContactDetailProps
) => {
  const { state }: { state: ContactModel } = useLocation();

  return (
    <div>
      <Navbar type="header" title={state.first_name} />
      <div css={styles.container}>
        <Icon
          icon="fluent:person-32-filled"
          color={theme.colors.text.dark}
          height={100}
          width={100}
        />
      </div>
      <p css={styles.contactName}>
        {state.first_name} {state.last_name}
      </p>
      <div css={styles.actions}>
        <div css={styles.actionIcon}>
          <Icon
            icon="ph:phone-fill"
            color={theme.colors.text.dark}
            height={50}
            width={50}
          />
          <p css={styles.actionText}>Call</p>
        </div>
        <div css={styles.actionIcon}>
          <Icon
            icon="ic:round-message"
            color={theme.colors.text.dark}
            height={50}
            width={50}
          />
          <p css={styles.actionText}>Message</p>
        </div>
        <div css={styles.actionIcon}>
          <Icon
            icon="carbon:video-filled"
            color={theme.colors.text.dark}
            height={50}
            width={50}
          />
          <p css={styles.actionText}>Video</p>
        </div>
      </div>
      {state.phones.map((items, index) => (
        <div css={styles.listNumber} key={index}>
          <Icon
            icon="ph:phone-fill"
            color={theme.colors.primary}
            height={20}
            width={20}
            css={{ marginRight: "5px" }}
          />
          <p css={styles.number}>{items.number}</p>
        </div>
      ))}
    </div>
  );
};

export default ContactDetailPage;
