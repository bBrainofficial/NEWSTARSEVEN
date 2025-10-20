// import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import { deleteAllFromCart } from "../../redux/actions/cartActions";
// !DEL
function CheckoutModal({
  quantityCount,
  currentLanguageCode,
  show,
  onHide,
  strings,
  products,
}) {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    zip: "",
    street: "",
    notes: "",
  });

  const [cities, setCities] = useState([]);
  const [deliveryFees, setDeliveryFees] = useState(0);

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
    const selectedCity = cities.find(
      (city) => city.id === parseInt(selectedCityId)
    );

    setFormData((prevData) => ({
      ...prevData,
      city: selectedCity ? selectedCity.id : "",
    }));

    // Set delivery fees based on the selected city's delivery_tax
    setDeliveryFees(selectedCity ? selectedCity.delivery_tax : 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload for the checkout API request
    const checkoutData = {
      f_name: formData.fName,
      l_name: formData.lName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      city: String(formData.city),
      zip: formData.zip,
      street: formData.street,
      notes: formData.notes,
      type: "cod", // assuming type 'cod' is needed by your backend
      cart: products.map((product) => ({
        item_id: product.id,
        qty: product?.pivot?.qty || quantityCount || 1,
      })),
    };

    try {
      // Modify the endpoint if your base URL is already included in the axios instance configuration
      const response = await axiosInstance.post("/checkout", checkoutData);
      if (response.data.status === "success") {
        // Handle success
        addToast(strings["Checkoutsuccessful"], { appearance: "success" });
        dispatch(deleteAllFromCart(addToast));

        onHide(); // Assuming `onHide` is a function to close the modal or form
      } else {
        // If the response status is not success
        addToast(strings["Checkoutwasnotsuccessful"], {
          appearance: "error",
        });
      }
    } catch (error) {
      // Handle errors
      console.error("Checkout failed", error);
      addToast(strings["Checkoutfailed"], { appearance: "error" });
    }
  };

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={onHide}
        className="product-quickview-modal-wrapper"
      >
        <Modal.Header closeButton>
          <Modal.Title>{strings["checkout_title"]}</Modal.Title>
        </Modal.Header>
        <div className="modal-body p-0">
          <div className="d-flex  justify-content-start align-items-center gap-3 p-1">
            {products?.map((el) => (
              <div className="d-flex gap-3 align-items-center" key={el.id}>
                <img
                  src={el?.image_path}
                  alt="el Images"
                  width={100}
                  height={100}
                  className="rounded"
                />
                <p>
                  {currentLanguageCode === "ar"
                    ? el.translations[0]?.name
                    : el.translations[1].name}
                  <br />
                  {el.price} X {quantityCount || el?.pivot?.qty || el?.qty || 1}
                </p>
              </div>
            ))}
          </div>
          <form>
            <Modal.Body className="p-0">
              <div className="checkout-modal-content p-3">
                {/* Contact Information */}
                <div className="mb-4">
                  <p className="fw-bold mb-3">{strings["contact_info"]}</p>

                  <div className="mb-3">
                    <input
                      type="text"
                      name="fName"
                      value={formData.fName}
                      onChange={handleInputChange}
                      placeholder={strings["first_name"]}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="lName"
                      value={formData.lName}
                      onChange={handleInputChange}
                      placeholder={strings["last_name"]}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={strings["email_optional"]}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={strings["phone"]}
                    />
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="mb-4">
                  <p className="fw-bold mb-3">{strings["shipping_info"]}</p>

                  <div className="mb-3">
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder={strings["street"]}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder={strings["country"]}
                    />
                  </div>
                  <div className="mb-3">
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleCityChange}
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
                  <div className="mb-3">
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder={strings["zip_code"]}
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder={strings["notes"]}
                    />
                  </div>
                </div>

                {/* Pricing Summary */}
                <div>
                  <p className="fw-bold mb-3">{strings["shipping_cost"]}</p>
                  <div className="d-flex justify-content-between">
                    <span>{strings["shipping_price"]}</span>
                    <span>
                      {deliveryFees} {strings["EG"]}
                    </span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>{strings["total"]}</span>
                    <span
                      style={{
                        direction: currentLanguageCode === "en" ? "ltr" : "rtl",
                      }}
                    >
                      {(
                        products.reduce((total, product) => {
                          const quantity =
                            quantityCount ||
                            product?.pivot?.qty ||
                            product?.qty ||
                            1;
                          return (
                            total +
                            (product?.price -
                              (product?.price * product?.discount) / 100) *
                              quantity
                          );
                        }, 0) + parseFloat(deliveryFees || 0)
                      ).toFixed(2)}{" "}
                      {/* Ensure the total is formatted to 2 decimal places */}
                      {strings["EG"]}
                    </span>
                  </div>
                  <p className="text-muted mt-1">{strings["tax_included"]}</p>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="d-flex flex-column gap-2">
              <button onClick={handleSubmit} className="btn btn-primary w-100">
                {strings["pay_on_delivery"]}
              </button>
            </Modal.Footer>
          </form>
        </div>
      </Modal>
    </Fragment>
  );
}

export default multilanguage(CheckoutModal);
