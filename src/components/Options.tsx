/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { theme } from "../theme/theme";
import { useMutation } from "@apollo/client";
import { DELETE_CONTACT } from "../graphql/mutations";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";

interface OptionsProps {
  optionOpen: boolean;
  setOptionOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		cursor: 'pointer',
		margin: '10px',
		':hover': {
			color: theme.colors.primary
		}
	}),
  optionsOpen: css({
    opacity: 1,
    pointerEvents: "auto",
    transform: "translateX(0%)",
  }),
  optionsClosed: css({
    opacity: 0,
    pointerEvents: "none",
    transform: "translateX(100%)",
  }),
};

const Options: React.FC<OptionsProps> = ({
  optionOpen,
  setOptionOpen,
}: OptionsProps) => {
  const [deleteContact, { data, loading, error }] = useMutation(DELETE_CONTACT);
  const navigate = useNavigate();
  const params = useParams();

  console.log(params);

  const onDelete = () => {
    deleteContact({ variables: { id: params.id } }).then(() =>
      navigate("/home")
    );
  };
  const onEdit = () => {
    console.log('edit');
  };
  const onFavorite = () => {
    console.log('fav');
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
        <div onClick={onFavorite} css={styles.optionBtn}>
          Favorite
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
