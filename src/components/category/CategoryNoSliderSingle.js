import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";

const CategoryNoSliderSingle = ({ data , isLast}) => {
  return (
    <div className={`col-4 mb-4 `}>
      <div className="content border rounded overflow-hidden shadow-sm">
        <div className="collection-img position-relative">
          <Link to={`/shop?category=${data.id}`}>
            {/* Overlay */}
            {/* <div
              className="collection-img-overlay p-3 position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-success text-white text-center"
              style={{
                transition: "opacity 0.3s ease-in-out",
                opacity: "0.8",
                zIndex: 1,
              }}
            >
              <h5 className="mt-2 border py-2 px-4 font-weight-bold">
                {currentLanguageCode === "ar"
                  ? data.translations[0].name
                  : data.translations[1].name}
              </h5>
            </div> */}
            {/* Image */}
            <img
              className="animated img-fluid w-100  justify-center  h-auto rounded-lg"
              src={`https://e-commerce.test.do-go.net/images/${data.logo}`}
              alt={data.name}
              style={{ objectFit: "cover" }}
     
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

CategoryNoSliderSingle.propTypes = {
  data: PropTypes.object,
};

export default multilanguage(CategoryNoSliderSingle);
