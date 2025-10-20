import PropTypes from "prop-types";
import React from "react";
import { setActiveLayout } from "../../helpers/product";
import { multilanguage } from "redux-multilanguage";

const ShopTopAction = ({
  getLayout,
  getFilterSortParams,
  productCount,
  sortedProductCount,
  strings
}) => {
  console.log(sortedProductCount,productCount,11111111111111111111111111111)
  return (
    <div className="shop-top-bar mb-35">
      
      {/* ✅ Sort Select Box */}
      <div className="select-shoing-wrap">
        <div className="shop-select">
          <select onChange={(e) => getFilterSortParams(e.target.value)}>
            <option value="default">{strings["default"]}</option>
            <option value="high-to-low">{strings["price_high_to_low"]}</option>
            <option value="low-to-high">{strings["price_low_to_high"]}</option>
          </select>
        </div>
        {/* ✅ Showing X of Y results */}
        <p>
          {strings["showing"]} {sortedProductCount} {strings["of"]} {productCount} {strings["results"]}
        </p>
      </div>

      {/* ✅ Layout Buttons */}
      <div className="shop-tab">
        <button
          onClick={(e) => {
            getLayout("grid two-column");
            setActiveLayout(e);
          }}
          title={strings["grid_two_column"]}
        >
          <i className="fa fa-th-large" />
        </button>
        <button
          onClick={(e) => {
            getLayout("grid three-column");
            setActiveLayout(e);
          }}
          title={strings["grid_three_column"]}
        >
          <i className="fa fa-th" />
        </button>
        <button
          onClick={(e) => {
            getLayout("list");
            setActiveLayout(e);
          }}
          title={strings["list_view"]}
        >
          <i className="fa fa-list-ul" />
        </button>
      </div>
    </div>
  );
};

ShopTopAction.propTypes = {
  getFilterSortParams: PropTypes.func,
  getLayout: PropTypes.func,
  productCount: PropTypes.number,
  sortedProductCount: PropTypes.number,
  strings: PropTypes.object
};

export default multilanguage(ShopTopAction);
