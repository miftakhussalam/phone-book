/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { theme } from "../theme/theme";
import { useEffect } from "react";

export interface ToastData {
  title: string;
  description?: string;
  type?: "success" | "error";
  openToast: boolean;
  hideDuration?: number;
}

interface ToastProps {
  data: ToastData;
  setData: React.Dispatch<React.SetStateAction<ToastData>>;
}

const styles = {
  root: css({}),
  container: css({
    position: "absolute",
    right: 50,
    padding: 10,
    margin: 10,
    background: theme.colors.background.main,
    transition: "all 0.3s ease",
    zIndex: 99,
    borderRadius: "10px",
		boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.5)",
  }),
  wrap: css({
    position: "absolute",
    padding: 0,
    right: 0,
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 9,
  }),
  title: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.colors.primary,
    fontWeight: "bold",
    fontSize: "18px",
    "&& p": {
      margin: 0,
    },
  }),
  description: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px",
    color: theme.colors.text.dark,
    "&& p": {
      margin: 0,
    },
  }),
  toastOpen: css({
    opacity: 1,
    pointerEvents: "auto",
    transform: "translateY(0%)",
  }),
  toastClosed: css({
    opacity: 0,
    pointerEvents: "none",
    transform: "translateY(-100%)",
  }),
};

const Toast: React.FC<ToastProps> = ({ data, setData }: ToastProps) => {
  useEffect(() => {
    if (data.openToast) {
			setTimeout(() => {
				setData({ ...data, openToast: false });
			}, (data.hideDuration = 2000));
		}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.openToast]);

  return (
    <div css={styles.root}>
      <div
        css={data?.openToast ? styles.wrap : {}}
        onClick={() => setData({ ...data, openToast: false })}
      ></div>
      <div
        css={[
          styles.container,
          data?.openToast ? styles.toastOpen : styles.toastClosed,
        ]}
      >
        <div css={styles.title}>
          <p>{data.title}</p>
        </div>
        <div css={styles.description}>
          <p>{data.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
