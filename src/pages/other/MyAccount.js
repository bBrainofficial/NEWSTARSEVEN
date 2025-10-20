import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import Loading from "../../components/Loading";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

// !DEL
const MyAccount = ({ location, strings, currentLanguageCode }) => {
  const history = useHistory();
  const [cities, setCities] = useState([]);
  const [orders, setOrders] = useState([]);
  const { pathname } = location;
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    city:"",
    addresses: [],
  });
    // const [formData, setFormData] = useState({
    //   fName: "",
    //   lName: "",
    //   address_id: "",
    //   email: "",
    //   phone: "",
    //   country: "",
    //   city: "",
    //   zip: "",
    //   street: "",
    //   notes: "",
    // });
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/user");
        if (response.status === 200) {
          console.log(response.data);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("orders");
        if (response.status === 200) {
          // Save the full response (orders.data contains the orders array)
          setOrders(response);
          console.log(response);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchUserData();
    fetchOrders();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const populateOrderDetails = (order,index) => {

    console.log(order)
        const address = order.get_address;


    // Populate missing data fields
    return {
      ...order,
      f_name: address?.f_name || strings["n_a"],
      l_name: address?.l_name || strings["n_a"],
      email: address?.email || strings["n_a"],
      phone: address?.phone || strings["n_a"],
      street: address?.street || strings["n_a"],
      country: address?.country || strings["n_a"],
      city: cities.find(city => city.id === address?.city) ? cities.find(city => city.id === address?.city).name : strings["n_a"], // Find the city name
      zip: address?.zip || strings["n_a"],
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/user/edit_profile", user);
      if (response.status === 200) {
        addToast("User Details Updated", { appearance: "success" });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        addToast(errorMessages, { appearance: "error" });
      } else {
        addToast("An unexpected error occurred", { appearance: "error" });
      }
      console.error("Profile update error:", error);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      addToast("Passwords do not match", { appearance: "error" });
      return;
    }
    try {
      const response = await axiosInstance.post("/user/password", {
        password: passwords.password,
      });
      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);
        addToast("Password successfully updated", { appearance: "success" });
        setPasswords({ password: "", confirmPassword: "" });
      } else {
        addToast("Failed to update password", { appearance: "error" });
      }
    } catch (error) {
      addToast("An error occurred while updating the password", { appearance: "error" });
      console.error("Password update error:", error);
    }
  };

  const handleAddressChange = (index, e) => {
    const updatedAddresses = user.addresses.map((address, i) => {
      if (i === index) {
        return { ...address, [e.target.name]: e.target.value };
      }
      return address;
    });
    setUser({ ...user, addresses: updatedAddresses });
  };

  const handleAddressSubmit = async (index, e) => {
    e.preventDefault();
    const address = user.addresses[index];
    try {
      const response = await axiosInstance.post(`/user/addresses/edit/${address.id}`, address);
      if (response.status === 200) {
        addToast("Address updated successfully", { appearance: "success" });
      }
    } catch (error) {
      console.error("Failed to update address:", error);
      addToast("Failed to update address", { appearance: "error" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("redux_localstorage_simple");
    localStorage.removeItem("authToken");
    history.push("/");
  };
  const getOrderStatus = (statusId) => {
    const statusMap = {
      6: strings["pending"],
      // 2: strings["processing"],
      // 3: strings["shipped"],
      // 4: strings["delivered"],
      // 5: strings["cancelled"],
      3: strings["completed"]
    };
    return statusMap[statusId] || strings["unknown_status"];
  };

    // Handle city change and calculate delivery fees
    const handleCityChange = (e) => {
      const selectedCityId = e.target.value;
      const selectedCity = cities.find(city => city.id.toString() === selectedCityId);
  
      setUser((prevData) => ({
        ...prevData,
        city: selectedCity ? selectedCity.id : "", // Store the selected city ID
      }));
  
      // Set delivery fees based on the selected city's delivery tax
      // setDeliveryFees(selectedCity ? selectedCity.delivery_tax : 0);
    };

  
  if (loading) {
    return <Loading />;
  }

  return (
    <Fragment>
      <MetaTags>
        <title>
          {strings["StarSeven"]} | {strings["my_account"]}
        </title>
        <meta
          name="description"
          content="Compare page of StarSeven react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["home"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["my_account"]}
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ml-auto mr-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <button onClick={handleLogout} className="btn mb-4">
                    {strings["logout"]}
                  </button>
                  <Accordion defaultActiveKey="0">
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="0">
                          <h3 className="panel-title">
                            <span>1 .</span> {strings["edit_account_info"]}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <form
                            onSubmit={handleSubmit}
                            className="myaccount-info-wrapper"
                          >
                            <div className="account-info-wrapper">
                              <span>{strings["account_info"]}</span>
                              {/* <span>{strings["personal_details"]}</span> */}
                            </div>
                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>{strings["first_name"]}</label>
                                  <input
                                    type="text"
                                    name="fname"
                                    value={user.fname || ""}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>{strings["last_name"]}</label>
                                  <input
                                    type="text"
                                    name="lname"
                                    value={user.lname || ""}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>{strings["email_address"]}</label>
                                  <input
                                    type="email"
                                    name="email"
                                    value={user.email || ""}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>{strings["telephone"]}</label>
                                  <input
                                    type="text"
                                    name="phone"
                                    value={user.phone || ""}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit">
                                  {strings["update"]}
                                </button>
                              </div>
                            </div>
                          </form>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="1">
                          <h3 className="panel-title">
                            <span>2 .</span> {strings["change_password"]}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>
                          <form
                            onSubmit={handlePasswordSubmit}
                            className="myaccount-info-wrapper"
                          >
                            <div className="account-info-wrapper">
                              <span>{strings["change_password"]}</span>
                              {/* <h5>{strings["password"]}</h5> */}
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>{strings["password"]}</label>

                                  <input
                                    type="password"
                                    name="password"
                                    value={passwords.password}
                                    onChange={handlePasswordChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>{strings["password_confirm"]}</label>
                                  <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handlePasswordChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit">
                                  {strings["continue"]}
                                </button>
                              </div>
                            </div>
                          </form>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="2">
                          <h3 className="panel-title">
                            <span>3 .</span> {strings["modify_address_book"]}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="2">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <span>{strings["address_book_entries"]}</span>
                            </div>
                            {user?.addresses?.map((address, index) => (
                              <div key={index} className="account-address-item">
                                <p>
                                  <span>{index + 1} .</span> Address {index + 1}
                                </p>
                                <form
                                  onSubmit={(e) =>
                                    handleAddressSubmit(index, e)
                                  }
                                >
                                  <div className="row">
                                    <div className="col-lg-6 col-md-6">
                                      <div className="billing-info mb-20">
                                        <label>{strings["first_name"]}</label>
                                        <input
                                          type="text"
                                          name="f_name"
                                          value={address.f_name}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="billing-info mb-20">
                                        <label>{strings["last_name"]}</label>
                                        <input
                                          type="text"
                                          name="l_name"
                                          value={address.l_name}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="billing-info mb-20">
                                        <label>{strings["country"]}</label>
                                        <input
                                          type="text"
                                          name="country"
                                          value={address.country}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="billing-info mb-20">
                                        <label>
                                          {strings["street_address"]}
                                        </label>
                                        <input
                                          placeholder={
                                            strings["apartment_suite"]
                                          }
                                          type="text"
                                          name="street"
                                          value={address.street}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="billing-info mb-20">
                                      <label>{strings["city"]}</label>
                              <select
                                name="city"
                                value={user.city} // Ensure value is tied to formData.city
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
                                          value={address.zip}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="billing-info mb-20">
                                        <label>{strings["phone"]}</label>
                                        <input
                                          type="text"
                                          name="phone"
                                          value={address.phone}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="billing-info mb-20">
                                        <label>
                                          {strings["email_address"]}
                                        </label>
                                        <input
                                          type="text"
                                          name="email"
                                          value={address.email}
                                          onChange={(e) =>
                                            handleAddressChange(index, e)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <button type="submit" className="btn">
                                    {strings["update"]}
                                  </button>
                                </form>
                              </div>
                            ))}

                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    {/* Orders Section (Accordion removed) */}
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="3">
                          <h3 className="panel-title">
                            <span>4 .</span> {strings["orders"]}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="3">
                        <Card.Body>
                          {orders && orders?.data?.map((order,index) => {
                            const completedOrder = populateOrderDetails(order,index);
                            return (
                              <Card key={completedOrder.id} className="mb-3">
                                <Card.Header>
                                  <h4>{strings["order_number"]}: {completedOrder.id}</h4>
                                </Card.Header>
                                <Card.Body>
                                  <div className="order-details">
                                    <p><strong>{strings["order_date"]}:</strong>  {new Date(completedOrder.created_at).toLocaleDateString()}</p>
                                    <p><strong>{strings["order_status"]}:</strong>  {getOrderStatus(completedOrder.status_id)}</p>
                                    <p><strong>{strings["delivery_tax"]}:</strong> {completedOrder.delivery_tax}</p>
                                    <p><strong>{strings["total_cost"]}:</strong> {completedOrder.totalCost}</p>
                                    <p><strong>{strings["payment"]}:</strong> {completedOrder.payment}</p>
                                    <p><strong>{strings["phone"]}:</strong> {completedOrder.phone}</p>
                                    <p><strong>{strings["email"]}:</strong> {completedOrder.email}</p>
                                    <p><strong>{strings["street_address"]}:</strong> {completedOrder.street}</p>
                                    <p><strong>{strings["country"]}:</strong> {completedOrder.country}</p>
                                    <p><strong>{strings["first_name"]}:</strong> {completedOrder.f_name}</p>
                                    <p><strong>{strings["last_name"]}:</strong> {completedOrder.l_name}</p>
                                    <p><strong>{strings["zip"]}:</strong> {completedOrder.zip}</p>
                                    <p><strong>{strings["city"]}:</strong> {completedOrder.city}</p>
                                    <p><strong>{strings["notes"]}:</strong> {completedOrder.notes || strings["none"]}</p>
                                  </div>
                                </Card.Body>
                              </Card>
                            );
                          })}
                        </Card.Body>
                      </Accordion.Collapse> 
                    </Card>

                  </Accordion>

                </div>

              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

MyAccount.propTypes = {
  location: PropTypes.object,
};

export default multilanguage(MyAccount);
