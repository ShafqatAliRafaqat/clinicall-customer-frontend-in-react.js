export const addFlashMessage = (message) => {
  console.log("ran add flash msgs++++", message);
  return {
    type: "ADD_FLASH_MESSAGE",
    message,
  };
};

export const deleteFlashMessage = (id) => {
  return {
    type: "DELETE_FLASH_MESSAGE",
    id,
  };
};

export default addFlashMessage;
