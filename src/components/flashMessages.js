import React from "react";
import { Button } from "@material-ui/core";
import { SnackbarProvider, useSnackbar } from "notistack";

function MyApp(props) {
  const { id, type, text } = props.message;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const variant =
    type === "error"
      ? "error"
      : type === "info"
      ? "info"
      : type === "warning"
      ? "warning"
      : "success";

  const vertical = "bottom";
  const horizontal = "right";

  const action = (key) => (
    <Button
      onClick={() => {
        closeSnackbar(key);
        props.deleteMsg(id);
      }}
    >
      Dismiss
    </Button>
  );
  setTimeout(() => {
    props.deleteMsg(id);
  }, 5000);

  return enqueueSnackbar(text, {
    variant: variant,
    autoHideDuration: 9000,
    action,
    anchorOrigin: {
      vertical: vertical,
      horizontal: horizontal,
    },
  });
}

const FlashMessage = (props) => (
  <SnackbarProvider maxSnack={1}>
    <MyApp message={props.message} deleteMsg={props.deleteFlashMessage} />
  </SnackbarProvider>
);

export default FlashMessage;
