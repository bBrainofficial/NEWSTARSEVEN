import React, { Fragment, useEffect, useState } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import CheckoutModal from "../../components/product/CheckoutModal";
import LayoutOne from "../../layouts/LayoutOne";
// import { deleteAllFromCart } from "../../redux/actions/cartActions";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import {
  checkout,
  checkoutWithoutUser,
  checkoutOneClick,
  checkoutOneClickWithoutUser,
} from "../../redux/actions/checkoutActions";

const Checkout = ({ location, strings, currentLanguageCode, cartItems }) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    address_id: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    zip: "",
    street: "",
    notes: "",
  });
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [type, setType] = useState("cod");
  const [last, Setlast] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [cities, setCities] = useState([]);
  const [deliveryFees, setDeliveryFees] = useState(0);
  // New state to toggle the address form
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("authToken")) {
        try {
          const response = await axiosInstance.get("/user");
          setUser(response.data.user);
          setAddresses(response.data.user.addresses);
          Setlast(response.data.user.addresses[0]?.city);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchData();
  }, []);  // <- Empty dependency array prevents infinite re-renders


  const cartTotalPrice = cartItems?.items?.reduce((total, item) => {
    return (
      total +
      (item?.price - (item?.price * item?.discount) / 100) *
      (item.pivot?.qty || item.qty || 1)
    );
  }, 0);

  const handleAddressSelect = (value) => {
    const numericValue = parseInt(value, 10); // Convert to integer
    setSelectedAddress(numericValue);

    // Find the selected address in the list
    const selectedAddr = addresses.find((address) => address.id === numericValue);

    if (selectedAddr) {
      const selectedCity = cities.find((city) => city.id === selectedAddr.city);

      setFormData((prevData) => ({
        ...prevData,
        city: selectedAddr.city, // Update city in formData
      }));

      // Update delivery fees based on the address' city
      setDeliveryFees(selectedCity ? selectedCity.delivery_tax : 0);
    }
  };

  // const handleCheckout = async () => {
  //   if (!selectedAddress) {
  //     addToast(strings["address_required"], { appearance: "error" });
  //     return;
  //   }

  //   const checkoutData = {
  //     address_id: selectedAddress,
  //     type,
  //     notes: formData.notes,
  //   };

  //   try {
  //     await axiosInstance.post("/checkout", checkoutData);
  //     addToast(strings["order_placed"], { appearance: "success" });
  //     dispatch(deleteAllFromCart(addToast));
  //   } catch (error) {
  //     console.error("Checkout failed:", error);
  //     addToast(strings["checkout_failed"], { appearance: "error" });
  //   }
  // };
  const handleCheckout = () => {
    const token = localStorage.getItem("authToken");

    if (token && !selectedAddress) {
      addToast(strings["address_required"], { appearance: "error" });
      return;
    }

    let checkoutData = {};

    if (token) {
      // User is logged in, use the selected address
      checkoutData = {
        address_id: selectedAddress,
        type,
        notes: formData.notes,
      };
    } else {
      // Guest checkout (no token), require full address details
      if (!formData.street || !formData.fName || !formData.lName || !formData.phone || !formData.city) {
        addToast("Please fill in all required fields.", { appearance: "error" });
        return;
      }

      checkoutData = {
        street: formData.street,
        f_name: formData.fName,
        l_name: formData.lName,
        email: formData.email || "",
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        zip: formData.zip,
        type,
        notes: formData.notes,
        cart: cartItems.items.map((item) => ({
          item_id: item.id,
          qty: item.qty || 1,
        })),
      };
    }

    dispatch(token ? checkout(checkoutData, addToast) : checkoutWithoutUser(checkoutData, addToast));
  };




  const handleCheckoutWithoutUser = () => {
    if (!cartItems?.items || cartItems.items.length === 0) {
      addToast("No items in cart", { appearance: "error" });
      return;
    }

    if (!formData.street || !formData.fName || !formData.lName || !formData.phone || !formData.city) {
      addToast("Please fill in all required fields.", { appearance: "error" });
      return;
    }

    const checkoutData = {
      street: formData.street,
      f_name: formData.fName,
      l_name: formData.lName,
      email: formData.email || "",
      phone: formData.phone,
      country: formData.country,
      city: formData.city,
      zip: formData.zip,
      type,
      notes: formData.notes,
      cart: cartItems.items.map((item) => ({
        item_id: item.id,
        qty: item.qty || 1,
      })),
    };

    dispatch(checkoutWithoutUser(checkoutData, addToast));
  };



  const handleCheckoutOneClick = (item_id) => {
    const checkoutData = {
      address_id: selectedAddress,
      type,
      notes: formData.notes,
      item_id,
    };

    dispatch(checkoutOneClick(checkoutData, addToast));
  };

  const handleCheckoutOneClickWithoutUser = (item_id) => {
    const checkoutData = {
      street: formData.street,
      f_name: formData.fName,
      l_name: formData.lName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      city: formData.city,
      zip: formData.zip,
      type,
      notes: formData.notes,
      item_id,
    };

    dispatch(checkoutOneClickWithoutUser(checkoutData, addToast));
  };
  // Fetch cities on component load
  useEffect(() => {
    axiosInstance
      .get("/cities")
      .then((res) => {
        setCities(res.data);
      })
      .catch((error) => {
        console.error("Error fetching cities", error);
        setCities([]);
      });
  }, []);

  // Handle city change and calculate delivery fees
  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;
    const selectedCity = cities.find(city => city.id.toString() === selectedCityId);

    if (!selectedCity) {
      addToast("Invalid city selected", { appearance: "error" });
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      city: selectedCity.id,
    }));

    setDeliveryFees(selectedCity.delivery_tax || 0);
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");

      // Prepare headers: Only send Authorization if user is logged in
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const requestData = {
        f_name: formData.fName,
        l_name: formData.lName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        zip: formData.zip,
        street: formData.street,
        notes: formData.notes,
        type: "cod",
      };

      const response = await axiosInstance.post("/user/addresses/add", requestData, config);

      if (response.data.status === "success") {
        setAddresses([...addresses, response.data.address]);
        setSelectedAddress(response.data.address.id);
        addToast(strings["address_added_success"], { appearance: "success" });

        // Hide the new address form once the address has been added
        setShowNewAddressForm(false);
      }
    } catch (error) {
      console.error("Failed to add new address:", error);
      addToast(strings["address_add_failed"], { appearance: "error" });
    }
  };


  const lastCity = cities.find((city) => city.id === formData.city);
  const lastTax = lastCity ? lastCity.delivery_tax : deliveryFees;

  return (
    <Fragment>
      <MetaTags>
        <title>
          {strings["StarSeven"]} | {strings["checkout"]}
        </title>
        <meta
          name="description"
          content="Checkout page of StarSeven react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["home"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["checkout"]}
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            <div className="col-lg-12">
              <div className="billing-info mb-20">
                {!user && (
                  <h2 className="text-center my-4">{strings["CASHBACK"]}</h2>
                )}
              </div>
            </div>
            {cartItems && cartItems?.items?.length >= 1 ? (
              <div className="row">
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <h3>{strings["billing_details"]}</h3>

                    {addresses.length > 0 && (
                      <div className="existing-addresses">
                        <h4>{strings["saved_addresses"]}</h4>
                        {addresses.map((address) => (
                          <div className="address-item" key={address.id}>
                            <input
                              type="radio"
                              name="address_id"
                              id={`address-${address.id}`}
                              className="address-radio"
                              value={address.id}
                              onChange={(e) =>
                                handleAddressSelect(e.target.value)
                              }
                              checked={selectedAddress === address.id}
                            />
                            <label
                              htmlFor={`address-${address.id}`}
                              className="address-label"
                            >
                              {address.f_name} {address.l_name} - {address.street}
                              , {address.city}, {address.country}
                            </label>
                          </div>
                        ))}
                        <button
                          className="btn mt-3"
                          type="button"
                          onClick={() =>
                            setShowNewAddressForm((prevState) => !prevState)
                          }
                        >
                          {showNewAddressForm
                            ? strings["cancel_new_address"]
                            : strings["add_new_address"]}
                        </button>
                      </div>
                    )}

                    {(addresses.length === 0 || showNewAddressForm) && (
                      <form onSubmit={handleAddNewAddress}>
                        <div className="row mt-3">
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>{strings["first_name"]}</label>
                              <input
                                type="text"
                                name="fName"
                                value={formData.fName}
                                onChange={handleInputChange}
                                placeholder={strings["first_name"]}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>{strings["last_name"]}</label>
                              <input
                                type="text"
                                name="lName"
                                value={formData.lName}
                                onChange={handleInputChange}
                                placeholder={strings["last_name"]}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>{strings["country"]}</label>
                              <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                placeholder={strings["country"]}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>{strings["street_address"]}</label>
                              <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleInputChange}
                                placeholder={strings["street"]}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>{strings["city"]}</label>
                              <select
                                name="city"
                                value={formData.city} // Ensure value is tied to formData.city
                                onChange={handleCityChange}
                                className="custom-select" // Add a class to match other inputs
                                style={{
                                  width: "100%",
                                  height: "45px",
                                  border: "1px solid #ddd",
                                  borderRadius: "5px",
                                  padding: "10px",
                                  fontSize: "14px",
                                  backgroundColor: "#fff",
                                  outline: "none",
                                }}
                              >
                                <option value="">{strings["select_city"]}</option>
                                {cities.map((city) => (
                                  <option key={city.id} value={city.id}>
                                    {currentLanguageCode === "ar"
                                      ? city.translations[0].name
                                      : city.translations[1].name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>{strings["postcode_zip"]}</label>
                              <input
                                type="text"
                                name="zip"
                                value={formData.zip}
                                onChange={handleInputChange}
                                placeholder={strings["zip_code"]}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>{strings["phone"]}</label>
                              <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder={strings["phone"]}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>{strings["email_address"]}</label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder={strings["email_optional"]}
                              />
                            </div>
                          </div>
                        </div>
                        <button className="btn" type="submit">
                          {strings["submit_address"]}
                        </button>
                      </form>
                    )}

                    <div className="additional-info-wrap mt-3">
                      <h4>{strings["additional_information"]}</h4>
                      <div className="additional-info ">
                        <label>{strings["order_notes"]}</label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder={strings["notes"]}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="your-order-area">
                    <h3>{strings["your_order"]}</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        {user && (
                          <div
                            className="your-order-top mb-3"
                            style={{ color: "$theme-color" }}
                          >
                            <ul>
                              <li>{strings["USER_POINTS"]}</li>
                              <li>{user?.points}</li>
                            </ul>
                          </div>
                        )}
                        <div className="your-order-top">
                          <ul>
                            <li>{strings["product"]}</li>
                            <li>{strings["total"]}</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {cartItems?.items.map((cartItem, key) => (
                              <li key={key}>
                                <span className="order-middle-left">
                                  {currentLanguageCode === "ar"
                                    ? cartItem?.translations[0]?.name
                                    : cartItem?.translations[1]?.name}{" "}
                                  X{" "}
                                  {cartItem.pivot?.qty ||
                                    cartItem?.qty ||
                                    1}
                                </span>{" "}
                                <span className="order-price">
                                  {(
                                    (cartItem?.price -
                                      (cartItem?.price * cartItem?.discount) /
                                      100) *
                                    (cartItem?.pivot?.qty ||
                                      cartItem?.qty ||
                                      1)
                                  ).toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">
                              {strings["shipping"]}
                            </li>
                            <li>{lastTax}</li>
                          </ul>
                        </div>
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">{strings["total"]}</li>
                            <li>
                              {(lastTax + cartTotalPrice).toFixed(2)} {strings["EG"]}
                            </li>
                          </ul>
                        </div>

                      </div>
                      <div className="payment-method"></div>
                    </div>

                    <div className="place-order mt-25">
                      {user ? (
                        <>
                          {/* For logged-in users */}
                          <button
                            className="btn-hover mb-3"
                            onClick={() => {
                              setType("points");
                              handleCheckout();
                            }}
                            disabled={Number(user?.points) <= Number(cartTotalPrice)}
                            style={{
                              display: Number(user?.points) <= Number(cartTotalPrice) ? "none" : "block",
                            }}
                            id="points-button"
                          >
                            {strings["place_order_with_points"]}
                          </button>
                          <button
                            className="btn-hover"
                            onClick={() => {
                              setType("cod");
                              handleCheckout();
                            }}
                            id="cod-button"
                          >
                            {strings["place_order_with_cod"]}
                          </button>
                        </>
                      ) : (
                        <>
                          {/* For guest users */}
                          <button
                            className="btn-hover mb-3"
                            onClick={() => {
                              setType("cod");
                              handleCheckoutWithoutUser();
                            }}
                            id="guest-checkout"
                          >
                            {strings["place_order_as_guest"]}
                          </button>
                        </>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      {strings["no_items_in_cart"]} <br />{" "}

                      <Link
                        to={process.env.PUBLIC_URL + "/shop"}
                        className="no-scale-link"
                        style={{ backgroundColor: "#000" }}
                      >
                        {strings["shop_now"]}
                      </Link>

                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData || { items: [] }, // Ensures cartItems is never undefined

    currency: state.currencyData,
  };
};

export default connect(mapStateToProps)(multilanguage(Checkout));
