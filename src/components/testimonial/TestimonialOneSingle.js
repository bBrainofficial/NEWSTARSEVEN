import PropTypes from "prop-types";
import React from "react";
import defaultImg from "../../assets/img/user.png";
import { multilanguage } from "redux-multilanguage";

// Star rating component
const StarRating = ({ rating }) => {
  return (
    <div className="star-rating" style={{ margin: "10px 0" }}>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={index}
            style={{
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              cursor: "default",
              color: ratingValue <= rating ? "#ffc107" : "#e4e5e9",
              fontSize: "24px",
              padding: "0 2px"
            }}
            disabled
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

const TestimonialOneSingle = ({ data, sliderClass, testimonialClass, strings }) => {
  console.log(data)
  return (
    <div
      className={`${
        testimonialClass ? testimonialClass : "single-testimonial"
      } text-center ${sliderClass ? sliderClass : ""}`}
    >
      <img 
        style={{width: "100px", height: "100px", borderRadius: "50%"}}
        src={data.user.image ? `${data.user.image}` : defaultImg}
        alt={`profile ${data.user.fname} ${data.user.lname}`} 
      />
      <p>{data.reviewText}</p>
      
      {/* Display star rating if rate exists */}
      {data.rate !== null && <StarRating rating={data.rate} />}

      <div className="client-info">
        <i className="fa fa-map-signs" />
        <h5>{data.user.name} </h5>
        <span>{strings["customer"]}</span>
      </div>
    </div>
  );
};

TestimonialOneSingle.propTypes = {
  data: PropTypes.object,
  sliderClass: PropTypes.string,
  testimonialClass: PropTypes.string,
  strings: PropTypes.object,
};

export default multilanguage(TestimonialOneSingle);