/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { css } from "@emotion/react";
import { theme } from "../theme/theme";
import { useNavigate } from "react-router-dom";
import Options from "./Options";

interface NavbarProps {
  searchValue?: string;
  setSearchValue?: React.Dispatch<React.SetStateAction<string>>;
  openModal?: boolean;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
  type: string | undefined;
  title?: string | undefined;
}

const styles = {
  container: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: theme.colors.secondary,
  }),
  searchBox: css({
    display: "flex",
    padding: 5,
    margin: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    color: theme.colors.background.main,
  }),
  inputSearch: css({
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
      borderRadius: '50%',
      transition: "all 0.3s ease",
      transform: "scale(1.2)",
    },
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

const Navbar: React.FC<NavbarProps> = ({
  searchValue,
  setSearchValue,
  openModal,
  setOpenModal,
  type,
  title,
}: NavbarProps) => {
  const [optionOpen, setOptionOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div css={styles.container}>
      {type === "search" ? (
        <div css={styles.searchBox}>
          <input
            css={styles.inputSearch}
            type="text"
            value={searchValue}
            onChange={(e) => {
              if (setSearchValue) return setSearchValue(e.target.value);
            }}
            placeholder="Search contact(s)..."
          />
          <div css={styles.btnSearch}>
            <Icon
              icon="cil:magnifying-glass"
              color={theme.colors.primary}
              height={20}
              width={20}
            />
          </div>
          <div
            css={styles.addButton}
            onClick={() => {
              if (setOpenModal) {
                setOpenModal(!openModal);
              }
            }}
          >
            <Icon
              icon="ic:outline-person-add"
              color={theme.colors.primary}
              height={20}
              width={20}
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
          <Options optionOpen={optionOpen} setOptionOpen={setOptionOpen} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
