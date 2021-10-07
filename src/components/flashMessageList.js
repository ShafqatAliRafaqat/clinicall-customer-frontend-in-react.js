import React from "react";
import { connect } from "react-redux";
import FlashMessage from "./flashMessages";
import { deleteFlashMessage } from "../redux/actions/flashMessages";

const FlashMessagesList = (props) => {
  const messages = props.messages.map((message) => (
    <FlashMessage
      key={message.id}
      message={message}
      deleteFlashMessage={props.deleteFlashMessage}
    />
  ));
  return <div style={{ color: "#131313", fontSize: "0px" }}>{messages}</div>;
};

function mapStateTopProps(state) {
  return {
    messages: state.flashMessages,
  };
}

export default connect(mapStateTopProps, { deleteFlashMessage })(
  FlashMessagesList
);
