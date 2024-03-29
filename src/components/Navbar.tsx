/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { css } from "@emotion/react";
import { theme } from "../theme/theme";
import { useNavigate } from "react-router-dom";
import Options from "./Options";
import useSearch from "../hooks/useSearch";
import useModal from "../hooks/useModal";
import useContactDetail from "../hooks/useContactDetail";
import { defaultContactDetail } from "../context/ContactDetailContext";

interface NavbarProps {
  searchValue?: string;
  setSearchValue?: React.Dispatch<React.SetStateAction<string>>;
  type: string | undefined;
  title?: string | undefined;
}

const styles = {
  container: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: theme.colors.secondary,
    padding: 5,
  }),
  searchBox: css({
    display: "flex",
    padding: 5,
    margin: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    color: theme.colors.background.main,
    "@media(min-width: 640px)": {
      width: "80%",
    },
  }),
  inputSearch: css({
    "@media(min-width: 640px)": {
      width: "80%",
      padding: 12,
    },
    // minWidth: '100%',
    padding: 5,
    textAlign: "center",
    borderColor: theme.colors.primary,
    border: "none",
    borderRadius: "10px",
    ":focus": {
      borderColor: theme.colors.secondary,
      outlineWidth: 1,
      outlineColor: theme.colors.primary,
    },
    "::placeholder": {
      color: theme.colors.text.dark,
    },
  }),
  btnSearch: css({
    position: "absolute",
    padding: 5,
    display: "flex",
    "@media(min-width: 640px)": {
      left: "11%",
    },
  }),
  btnSearchIcon: css({
    height: 20,
    width: 20,
  }),
  addButton: css({
    padding: 5,
    display: "flex",
    marginLeft: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    // transform: "scale(0)",
    ":hover": {
      background: theme.colors.background.main,
      borderRadius: "50%",
      transition: "all 0.3s ease",
      transform: "scale(1.2)",
    },
  }),
  addButtonIcon: css({
    height: 25,
    width: 25,
  }),
  containerTitle: css({
    padding: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }),
  backBtn: css({
    position: "absolute",
    padding: 5,
    left: 0,
    cursor: "pointer",
  }),
  optionBtn: css({
    position: "absolute",
    padding: 5,
    right: 0,
    cursor: "pointer",
  }),
  title: css({
    padding: 5,
    fontSize: 16,
    fontWeight: "bolder",
    // color: theme.colors.text.light
  }),
};

const Navbar: React.FC<NavbarProps> = ({ type, title }: NavbarProps) => {
  const [optionOpen, setOptionOpen] = useState<boolean>(false);
  const { openModal, setOpenModal } = useModal();
  const {setContactDetail} = useContactDetail();
  const navigate = useNavigate();

  const { setSearchValue, searchValue } = useSearch();

  return (
    <div css={styles.container}>
      {type === "search" ? (
        <div css={styles.searchBox}>
          <input
            css={styles.inputSearch}
            type="text"
            value={searchValue}
            onChange={(e) => {
              if (setSearchValue) return setSearchValue(e.target.value!);
            }}
            placeholder="Search contact(s)..."
          />
          <div css={styles.btnSearch}>
            <Icon
              icon="cil:magnifying-glass"
              color={theme.colors.primary}
              css={styles.btnSearchIcon}
            />
          </div>
          <div
            css={styles.addButton}
            onClick={() => {
              if (setOpenModal) {
                setOpenModal(!openModal);
                setContactDetail(defaultContactDetail);
              }
            }}
          >
            <Icon
              icon="ic:outline-person-add"
              color={theme.colors.primary}
              css={styles.addButtonIcon}
            />
          </div>
        </div>
      ) : (
        <div css={styles.containerTitle}>
          <div css={styles.backBtn} onClick={() => navigate(-1)}>
            <Icon
              icon="uil:arrow-left"
              color={theme.colors.primary}
              height={30}
              width={30}
            />
          </div>
          <div css={styles.title}>{title}</div>
          <div
            css={styles.optionBtn}
            onClick={() => setOptionOpen(!optionOpen)}
          >
            <Icon
              icon="pepicons-pop:dots-y"
              color={theme.colors.primary}
              height={30}
              width={30}
            />
          </div>
          <Options
            optionOpen={optionOpen}
            setOptionOpen={setOptionOpen}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
