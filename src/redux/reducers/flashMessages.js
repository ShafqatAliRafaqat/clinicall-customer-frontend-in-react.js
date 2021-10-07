import shortid from "shortid";

export const flashMessages = (state = [], action = {}) => {
  switch (action.type) {
    case "ADD_FLASH_MESSAGE":
      const { type, text } = action.message;

      const validType =
        ["info", "warning", "error", "success"].indexOf(type) !== -1
          ? type
          : "success";

      return !state.length
        ? [
            ...state,
            {
              id: shortid.generate(),
              type: validType,
              text: text,
            },
          ]
        : state;

    case "DELETE_FLASH_MESSAGE":
      return state.filter((message) => message.id !== action.id);

    default:
      return state;
  }
};

export default flashMessages;
