/** @jsxImportSource @emotion/react */
import React from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Icon } from "@iconify/react";
import { css } from "@emotion/react";
import { Link } from "react-router-dom";
import { ContactModel } from "../graphql/models";
import { GET_CONTACT_AGGREGATE, GET_CONTACT_LIST } from "../graphql/queries";
import { theme } from "../theme/theme";
import { favoriteContactsVar } from "../graphql/cache";
import useSearch from "../hooks/useSearch";

interface ContactListProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
}

interface DataModel {
  contact: ContactModel[] | [];
}

const styles = {
  container: css({
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  }),
  title: css({
    margin: "10px 0",
    fontWeight: "bold",
    color: theme.colors.primary,
  }),
  card: css({
    display: "flex",
    flexDirection: "row",
    textDecoration: "none",
    // justifyContent: 'le',
    alignItems: "center",
    margin: 5,
    padding: 5,
    width: "90%",
    borderRadius: "7px",
    boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.5)",
    // marginLeft: '10px',
    transition: "all 0.3s ease",
    ":hover": {
      background: theme.colors.background.main,
      transition: "all 0.3s ease",
      transform: "translateX(5px)",
      marginLeft: "10px",
    },
  }),
  contact: css({
    display: "flex",
    flexDirection: "column",
  }),
  contactIcon: css({
    background: theme.colors.primary,
    borderRadius: "50%",
    height: 35,
    width: 35,
    margin: 5,
  }),
  contactName: css({
    margin: 0,
    fontSize: 16,
    fontWeight: "bolder",
    color: theme.colors.primary,
  }),
  chevronButton: css({
    margin: 0,
    background: "none",
    border: "none",
    // borderRadius: '50%',
    cursor: "pointer",
    transition: "all 0.3s ease",
    ":hover": {
      color: theme.colors.secondary,
      transition: "all 0.3s ease",
    },
  }),
  contactNumber: css({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 0,
    fontSize: 12,
    fontWeight: "bolder",
    color: theme.colors.text.dark,
  }),
  paginations: css({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }),
  pageBtn: css({
    padding: "5px 10px",
    margin: 5,
    background: theme.colors.secondary,
    border: "none",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ":hover": {
      cursor: "pointer",
      boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.5)",
    },
  }),
  loader: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
};

const ContactList: React.FC<ContactListProps> = ({
  currentPage,
  setCurrentPage,
  itemsPerPage,
}: ContactListProps) => {
  const { searchValue } = useSearch();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const favoriteContacts = useReactiveVar(favoriteContactsVar);

  const { loading, data } = useQuery<DataModel>(GET_CONTACT_LIST, {
    variables: {
      where: {
        _or: [
          {
            first_name: {
              _ilike: `%${searchValue}%`,
            },
          },
          {
            last_name: {
              _ilike: `%${searchValue}%`,
            },
          },
        ],
        _not: {
          id: {
            _in: favoriteContacts.map((items) => items.id),
          },
        },
      },
      order_by: [{ first_name: "asc" }],
      limit: itemsPerPage,
      offset: startIndex,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-only",
  });

  const { data: totalData } = useQuery(GET_CONTACT_AGGREGATE, {
    variables: {
      where: {
        _or: [
          {
            first_name: {
              _ilike: `%${searchValue}%`,
            },
          },
          {
            last_name: {
              _ilike: `%${searchValue}%`,
            },
          },
        ],
        _not: {
          id: {
            _in: favoriteContacts.map((items) => items.id),
          },
        },
      },
    },
  });

  const totalPages = Math.ceil(
    (totalData?.contact_aggregate?.aggregate?.count || 0) / itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading)
    return (
      <div css={styles.loader}>
        <Icon
          icon="eos-icons:three-dots-loading"
          color={theme.colors.primary}
          height={100}
          width={100}
        />
      </div>
    );

  return (
    <div css={styles.container}>
      {favoriteContacts.length !== 0 ? (
        <p css={styles.title}>favorite contact</p>
      ) : null}

      {favoriteContacts.length !== 0
        ? favoriteContacts.map((items) => {
            return (
              <Link
                rel="preload"
                css={styles.card}
                key={items.id}
                to={`/contact/${items.id}`}
                state={items}
              >
                <Icon
                  icon="bi:person-circle"
                  color={theme.colors.text.light}
                  height={20}
                  width={20}
                  css={styles.contactIcon}
                />
                <div css={styles.contact}>
                  <p css={styles.contactName}>
                    {items.first_name} {items.last_name}
                  </p>
                  {items?.phones?.map((numb, index) => (
                    <p css={styles.contactNumber} key={index}>
                      {/* <Icon
                        icon="ph:phone-fill"
                        color={theme.colors.text.dark}
                        height={12}
                        width={12}
                        css={{ marginRight: "5px" }}
                      /> */}
                      {numb.number || ""}
                    </p>
                  ))}
                </div>
              </Link>
            );
          })
        : null}
      <p css={styles.title}>regular contact</p>
      {data?.contact.length !== 0
        ? data?.contact.map((items) => {
            return (
              <Link
                css={styles.card}
                key={items.id}
                to={`/contact/${items.id}`}
                state={items}
              >
                <Icon
                  icon="bi:person-circle"
                  color={theme.colors.text.light}
                  height={20}
                  width={20}
                  css={styles.contactIcon}
                />
                <div css={styles.contact}>
                  <p css={styles.contactName}>
                    {items.first_name} {items.last_name}
                  </p>
                  {items?.phones?.map((numb, index) => (
                    <p css={styles.contactNumber} key={index}>
                      {/* <Icon
                        icon="ph:phone-fill"
                        color={theme.colors.text.dark}
                        height={12}
                        width={12}
                        css={{ marginRight: "5px" }}
                      /> */}
                      {numb.number || ""}
                    </p>
                  ))}
                </div>
              </Link>
            );
          })
        : "No data to display"}
      <div css={styles.paginations}>
        <button
          id="prevBtn"
          aria-label="Previus Button"
          css={styles.pageBtn}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Icon
            icon="ooui:previous-ltr"
            color={theme.colors.text.dark}
            height={16}
            width={16}
            css={{ marginRight: "5px" }}
          />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          id="nextBtn"
          aria-label="Next Button"
          css={styles.pageBtn}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Icon
            icon="ooui:next-ltr"
            color={theme.colors.text.dark}
            height={16}
            width={16}
            css={{ marginRight: "5px" }}
          />
        </button>
      </div>
    </div>
  );
};

export default ContactList;
