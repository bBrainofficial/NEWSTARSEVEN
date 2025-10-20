import axiosInstance from "../../api/api";

export const ADD_TO_WISHLIST = "ADD_TO_WISHLIST";
export const DELETE_FROM_WISHLIST = "DELETE_FROM_WISHLIST";
export const DELETE_ALL_FROM_WISHLIST = "DELETE_ALL_FROM_WISHLIST";
export const WISHLIST_FAILURE = "WISHLIST_FAILURE";
export const WISHLIST_FETCH = "WISHLIST_FETCH";

// Define a local storage key for the wishlist
const LOCAL_WISHLIST_KEY = "localWishlist";

// Helper function to get the wishlist from localStorage
const getLocalWishlist = () => {
  try {
    const data = localStorage.getItem(LOCAL_WISHLIST_KEY);
    if (data) {
      return JSON.parse(data).wishlistData || [];
    }
    return [];
  } catch (error) {
    console.error("Error parsing local wishlist:", error);
    return [];
  }
};

// Helper function to set the wishlist in localStorage
const setLocalWishlist = (wishlist) => {
  localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify({ wishlistData: wishlist }));
};

// Add to wishlist
export const addToWishlist = (item, addToast) => {
  return (dispatch) => {
    console.log(item)
    dispatch({
      type: ADD_TO_WISHLIST,
      payload: { item },
    });

    if (addToast) {
      addToast("Added To Wishlist", {
        appearance: "success",
        autoDismiss: true,
      });
    }

    if (localStorage.getItem("authToken")) {
      // If the user is logged in, update the server
      axiosInstance
        .post("/user/update-fav", { item_id: item?.item_id || item?.id })
        .catch((error) => {
          dispatch({
            type: WISHLIST_FAILURE,
            payload: error,
          });
        });
    } else {
      // Update wishlist in local storage
      const wishlist = getLocalWishlist();
      // Check if item already exists to prevent duplicates
      const exists = wishlist.find(
        (wishlistItem) =>
          (wishlistItem.item_id || wishlistItem.id) === (item.item_id || item.id)
      );
      if (!exists) {
        wishlist.push(item);
        setLocalWishlist(wishlist);
      }
    }
  };
};

// Delete from wishlist
export const deleteFromWishlist = (item, addToast) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_FROM_WISHLIST,
      payload: { item },
    });

    if (addToast) {
      addToast("Removed From Wishlist", {
        appearance: "error",
        autoDismiss: true,
      });
    }

    if (localStorage.getItem("authToken")) {
      // If the user is logged in, update the server
      axiosInstance
        .post("/user/update-fav", { item_id: item?.item_id || item?.id })
        .catch((error) => {
          dispatch({
            type: WISHLIST_FAILURE,
            payload: error,
          });
        });
    } else {
      // Update wishlist in local storage by removing the item
      let wishlist = getLocalWishlist();
      wishlist = wishlist.filter(
        (wishlistItem) =>
          (wishlistItem.item_id || wishlistItem.id) !== (item.item_id || item.id)
      );
      setLocalWishlist(wishlist);
    }
  };
};

// Get wishlist
export const getWishlist = () => {
  return (dispatch) => {
    if (localStorage.getItem("authToken")) {
      // For logged in users, fetch wishlist from the server
      axiosInstance
        .get("/user/my-favorites")
        .then((response) => {
          // Assuming response.data is an array of favorites where each has an 'item'
          const items = response.data.map((favorite) => favorite.item);
          dispatch({
            type: WISHLIST_FETCH,
            payload: items,
          });
        })
        .catch((error) => {
          dispatch({
            type: WISHLIST_FAILURE,
            payload: error,
          });
        });
    } else {
      // For non-authenticated users, get wishlist from localStorage
      const wishlist = getLocalWishlist();
      dispatch({
        type: WISHLIST_FETCH,
        payload: wishlist,
      });
    }
  };
};

// Optionally, delete all from wishlist
export const deleteAllFromWishlist = (addToast) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_ALL_FROM_WISHLIST,
    });

    if (addToast) {
      addToast("Cleared Wishlist", {
        appearance: "error",
        autoDismiss: true,
      });
    }

    if (localStorage.getItem("authToken")) {
      // Optionally, send a request to clear the wishlist on the server if needed
    } else {
      // Clear the wishlist from localStorage
      setLocalWishlist([]);
    }
  };
};
