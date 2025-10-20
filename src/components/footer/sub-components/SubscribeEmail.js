import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../../api/api";

const SubscribeEmail = ({ strings }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // "sending", "success", "error"
  const [message, setMessage] = useState("");

  const emailRef = useRef(null); // Using ref to get email input value

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || email.indexOf("@") === -1) return;

    setStatus("sending");
    setMessage("");

    try {
      const response = await axiosInstance.post("/subscriptions", { email });
      if (response.status === 200) {
        setStatus("success");
        setMessage(strings["subscribe_success"]);
      } else {
        setStatus("error");
        setMessage(strings["subscribe_error"]);
      }
    } catch (error) {
      setStatus("error");
      setMessage(strings["subscribe_error"]);
    }
  };

  const getStatusMessage = () => {
    let color, messageContent;

    switch (status) {
      case "sending":
        color = "#3498db";
        messageContent = strings["sending"];
        break;
      case "error":
        color = "#e74c3c";
        messageContent = message;
        break;
      case "success":
        color = "#2ecc71";
        messageContent = message;
        break;
      default:
        return null;
    }

    return (
      <div
        style={{ color, fontSize: "12px" }}
        dangerouslySetInnerHTML={{ __html: messageContent }}
      />
    );
  };

  return (
    <div className="subscribe-form">
      {/* CSS for custom bottom border on focus */}
      <style>{`
        .subscribe-form .email {
          color: white;
          background: transparent;
          border: none;
          border-bottom: 2px solid white; /* Default bottom border */
          outline: none;
          padding: 5px;
          transition: border-bottom 0.3s ease-in-out;
        }
        
        .subscribe-form .email:focus {
          border-bottom: 2px solid #f39c12; /* Change color on focus */
        }
        
        .subscribe-form .email::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>

      <form onSubmit={handleSubmit}>
        <div className="mc-form">
          <div>
            <input
              className="email"
              ref={emailRef}
              type="email"
              placeholder={strings["email_placeholder"]}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "sending"}
            />
          </div>
          {getStatusMessage()}
          <div className="clear">
            <button
              className="button"
              disabled={status === "sending"}
              type="submit"
            >
              {strings["subscribe_button"]}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

SubscribeEmail.propTypes = {
  mailchimpUrl: PropTypes.string,
};

export default multilanguage(SubscribeEmail);
