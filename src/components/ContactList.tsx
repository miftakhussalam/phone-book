/** @jsxImportSource @emotion/react */
import React from "react";
import { useQuery } from "@apollo/client";
import { Icon } from "@iconify/react";
import { css } from "@emotion/react";
import { Link } from "react-router-dom";
import { ContactModel } from "../graphql/models";
import { GET_CONTACT_AGGREGATE, GET_CONTACT_LIST } from "../graphql/queries";
import { theme } from "../theme/theme";

interface ContactListProps {
  searchValue: string;
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
  card: css({
    display: "flex",
    flexDirection: "column",
    textDecoration: "none",
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
  outerContactName: css({
    display: "flex",
    flexDirection: "row",
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
    ":hover": {
      color: theme.colors.secondary,
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }),
};

const ContactList: React.FC<ContactListProps> = ({
  searchValue,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}: ContactListProps) => {
  const startIndex = (currentPage - 1) * itemsPerPage;

  const { loading, error, data } = useQuery<DataModel>(GET_CONTACT_LIST, {
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
      },
    },
  });

  const totalPages = Math.ceil(
    (totalData?.contact_aggregate?.aggregate?.count || 0) / itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) return <div>loading...</div>;

  return (
    <div css={styles.container}>
      {error ? `Error! ${error.message}` : ""}
      {data?.contact.length !== 0
        ? data?.contact.map((items) => {
            return (
              <Link
                css={styles.card}
                key={items.id}
                to={`/contact/${items.id}`}
                state={items}
              >
                <div css={{ display: "flex", justifyContent: "space-between" }}>
                  <div css={styles.outerContactName}>
                    <Icon
                      icon="material-symbols:person"
                      color={theme.colors.text.dark}
                      height={20}
                      width={20}
                      css={{ marginRight: "5px" }}
                    />
                    <p css={styles.contactName}>
                      {items.first_name} {items.last_name}
                    </p>
                  </div>
                </div>
                {/* <div>
                  {items?.phones?.map((numb, index) => (
                    <p css={styles.contactNumber} key={index}>
                      <Icon
                        icon="ph:phone-fill"
                        color={theme.colors.text.dark}
                        height={12}
                        width={12}
                        css={{ marginRight: "5px" }}
                      />
                      {numb.number || ""}
                    </p>
                  ))}
                </div> */}
              </Link>
            );
          })
        : "Contact is empty"}
      <div css={styles.paginations}>
        <button
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
