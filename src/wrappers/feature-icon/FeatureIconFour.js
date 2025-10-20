import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/api.js";
import FeatureIconFourSingle from "../../components/feature-icon/FeatureIconFourSingle.js";
// !DEL
const FeatureIconFour = ({
  spaceTopClass,
  spaceBottomClass,
  containerClass,
  gutterClass,
  responsiveClass,
  bgImg,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/features");
        setData(response.data || []); // Ensure response structure is correct
        console.log('features',response.data)
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Handle loading state
  if (loading) {
    return <div className="loading-spinner" />;
  }
  return (
    <div
      className={`support-area hm9-section-padding ${
        spaceTopClass ? spaceTopClass : ""
      } ${spaceBottomClass ? spaceBottomClass : ""} ${
        responsiveClass ? responsiveClass : ""
      }`}
      style={
        bgImg
          ? { backgroundImage: `url(${process.env.PUBLIC_URL + bgImg})` }
          : {}
      }
    >
      <div
        className={`${containerClass ? containerClass : ""} ${
          gutterClass ? gutterClass : ""
        }`}
      >
        <div className="row">
          {data &&
            data.map((single, key) => {
              return (
                <FeatureIconFourSingle
                  data={single}
                  spaceBottomClass="mb-10"
                  key={key}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

FeatureIconFour.propTypes = {
  bgImg: PropTypes.string,
  containerClass: PropTypes.string,
  gutterClass: PropTypes.string,
  responsiveClass: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
};

export default FeatureIconFour;
