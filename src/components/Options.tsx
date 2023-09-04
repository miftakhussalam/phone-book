/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { theme } from "../theme/theme";
import { useMutation } from "@apollo/client";
import { DELETE_CONTACT } from "../graphql/mutations";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { favoriteContactsVar } from "../graphql/cache";
import { ContactModel } from "../graphql/models";

interface OptionsProps {
  optionOpen: boolean;
  setOptionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const styles = {
  container: css({}),
  wrap: css({
    position: "absolute",
    padding: 0,
    right: 0,
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  }),
  modal: css({
    position: "absolute",
    padding: 10,
    margin: 10,
    right: 5,
    top: 5,
    background: theme.colors.background.main,
    transition: "all 0.3s ease",
    zIndex: 2,
  }),
  optionBtn: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    margin: "10px",
    ":hover": {
      color: theme.colors.primary,
    },
  }),
  optionsOpen: css({
    opacity: 1,
    pointerEvents: "auto",
    transform: "translateY(0%)",
  }),
  optionsClosed: css({
    opacity: 0,
    pointerEvents: "none",
    transform: "translateY(-100%)",
  }),
};

const Options: React.FC<OptionsProps> = ({
  optionOpen,
  setOptionOpen,
  openModal,
  setOpenModal,
}: OptionsProps) => {
  const [deleteContact] = useMutation(DELETE_CONTACT);
  const navigate = useNavigate();
  const params = useParams();
  const { state } = useLocation();

  const isFavorite = (contact: ContactModel) => {
    return favoriteContactsVar().some(item => {
      return item.id === contact.id
    })
  };

  const onDelete = () => {
    deleteContact({ variables: { id: params.id } }).then(() =>
      navigate("/home")
    );
  };
  const onEdit = () => {
    setOptionOpen(false);
    setOpenModal(true);
  };

  const onFavorite = () => {
    if (isFavorite(state)) {
      const filteredContact: ContactModel[] = favoriteContactsVar().filter(item => item.id !== state.id);
      favoriteContactsVar(filteredContact);
      localStorage.setItem("fav", JSON.stringify(filteredContact));
    } else {
      favoriteContactsVar([...favoriteContactsVar(), state]);
      localStorage.setItem("fav", JSON.stringify(favoriteContactsVar()));
    }
    setOptionOpen(false);
  };

  return (
    <div css={styles.container}>
      <div
        css={optionOpen ? styles.wrap : {}}
        onClick={() => setOptionOpen(false)}
      ></div>
      <div
        css={[
          styles.modal,
          optionOpen ? styles.optionsOpen : styles.optionsClosed,
        ]}
      >
        <div onClick={onEdit} css={styles.optionBtn}>
          Edit
          <Icon
            icon="pepicons-pop:pen"
            color={theme.colors.primary}
            height={20}
            width={20}
          />
        </div>
        <div onClick={() => onFavorite()} css={styles.optionBtn}>
          {isFavorite(state) ? 'Unfavorite' : 'Favorite'}
          <Icon
            icon="ic:baseline-star"
            color={theme.colors.primary}
            height={20}
            width={20}
          />
        </div>
        <div onClick={onDelete} css={styles.optionBtn}>
          delete
          <Icon
            icon="mdi:trash-outline"
            color={theme.colors.primary}
            height={20}
            width={20}
          />
        </div>
      </div>
    </div>
  );
};

export default Options;
