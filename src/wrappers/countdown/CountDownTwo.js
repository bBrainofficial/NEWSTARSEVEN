import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Countdown from "react-countdown-now";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";

import axiosInstance from "../../api/api";
import Renderer from "../../components/countdown/Renderer";

const CountDownTwo = ({ spaceTopClass, spaceBottomClass, strings }) => {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferOfDay = async () => {
      try {
        const response = await axiosInstance.get("/offer-of-day");
        setOffer(response.data);
      } catch (err) {
        console.error("Error fetching deal of the day:", err);
        setOffer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferOfDay();
  }, []);

  return (
    <div
      className={`funfact-area ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="container">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="funfact-content funfact-res text-center">
                <h2>{strings["deal_of_the_day"]}</h2>
                <div className="timer">
                  <Countdown
                    date={new Date(offer?.end_at)}
                    renderer={Renderer}
                  />
                </div>
                <div className="funfact-btn funfact-btn-green btn-hover">
                  <Link to={process.env.PUBLIC_URL + "/shop"}>
                    {strings["shop_now"]}
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="fruits-deal-img">
                <Link to={process.env.PUBLIC_URL + "/shop"}>
                  <img
                    src={`https://zaien.test.do-go.net/images/${offer?.image}`}
                    alt="deal of day"
                    loading="lazy"
                  />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CountDownTwo.propTypes = {
  dateTime: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
};

export default multilanguage(CountDownTwo);
