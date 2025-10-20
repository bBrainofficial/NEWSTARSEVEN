export const ADD_TO_COMPARE = "ADD_TO_COMPARE";
export const DELETE_FROM_COMPARE = "DELETE_FROM_COMPARE";

export const addToCompare = (item, addToast) => (dispatch, getState) => {
  const { compareData } = getState(); // Get current compare state

  const exists = compareData.find(compareItem => compareItem.id === item.id);

  if (!exists) {
    if (addToast) {
      addToast("Added To Compare", {
        appearance: "success",
        autoDismiss: true
      });
    }
    dispatch({ type: ADD_TO_COMPARE, payload: item });
  } else {
    dispatch(deleteFromCompare(item, addToast)); // If exists, remove it
  }
};

export const deleteFromCompare = (item, addToast) => dispatch => {
  if (addToast) {
    addToast("Removed From Compare", {
      appearance: "error",
      autoDismiss: true
    });
  }
  dispatch({ type: DELETE_FROM_COMPARE, payload: item });
};
