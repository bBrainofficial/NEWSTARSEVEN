import PropTypes from "prop-types";
import React from "react";
// !DEL
const FeatureIconFourSingle = ({ data, spaceBottomClass }) => {
  return (
    <div className="col-lg-4 col-md-6 col-sm-6">
      <div
        className={`support-wrap-3 text-center ${
          spaceBottomClass ? spaceBottomClass : ""
        }`}
      >
        <img
          className="animated"
          src={process.env.PUBLIC_URL + data.image_path}
          alt=""
          style={{
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};

FeatureIconFourSingle.propTypes = {
  data: PropTypes.object,
  spaceBottomClass: PropTypes.string,
};

export default FeatureIconFourSingle;
