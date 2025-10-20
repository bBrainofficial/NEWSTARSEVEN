import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Swiper from "react-id-swiper";
import TestimonialOneSingle from "../../components/testimonial/TestimonialOneSingle.js";
import axiosInstance from "../../api/api.js";

const TestimonialOne = ({
  spaceTopClass,
  spaceBottomClass,
  spaceLeftClass,
  spaceRightClass,
  bgColorClass,
  testimonialClass,
  className
}) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        const response = await axiosInstance.get("/reviews");
        if (response.status === 200 && Array.isArray(response.data)) {
          // Extract relevant review data
          const formattedReviews = response.data.slice(0, 5).map((review) => ({
            id: review.id,
            rate: review.rate,
            reviewText: review.review || "No review text provided.", // Default text
            user: review.user
              ? {
                  name: `${review.user.fname} ${review.user.lname}`,
                  image: review.user.image
                    ? `https://e-commerce.test.do-go.net/images/${review.user.image}`
                    : "/assets/img/default-user.png", // Default user image
                }
              : {
                  name: "Anonymous",
                  image: "/assets/img/default-user.png",
                },
          }));

          setReviews(formattedReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewsData();
  }, []);

  if (isLoading) {
    return <div className="loading-spinner" />;
  }

  // Swiper slider settings
  const settings = {
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  };

  return (
    <>
      {reviews.length > 0 ? (
        <div
          className={`testimonial-area ${spaceTopClass || ""} ${className || ""} ${
            spaceBottomClass || ""
          } ${spaceLeftClass || ""} ${spaceRightClass || ""} ${bgColorClass || ""}`}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-10 ml-auto mr-auto">
                <div className="testimonial-active nav-style-1 nav-testi-style">
                  <Swiper {...settings}>
                    {reviews.map((single, key) => (
                      <TestimonialOneSingle
                        data={single}
                        key={key}
                        sliderClass="swiper-slide"
                        testimonialClass={testimonialClass}
                      />
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

TestimonialOne.propTypes = {
  bgColorClass: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
  testimonialClass: PropTypes.string,
};

export default TestimonialOne;
