import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import { setCurrency } from "../../redux/actions/currencyActions";
import LanguageCurrencyChanger from "./sub-components/LanguageCurrencyChanger";

const HeaderTop = ({
  currency,
  setCurrency,
  currentLanguageCode,
  dispatch,
  borderStyle,
  strings,
}) => {
  const [footer, setFooter] = useState();

  useEffect(() => {
    axiosInstance
      .get("/settings")
      .then((res) => setFooter(res.data))
      .catch(() => setFooter({}));
  }, []);

  return (
    <div
      className={`header-top-wap `}
    >
      <LanguageCurrencyChanger
        currency={currency}
        footer={footer}
        setCurrency={setCurrency}
        currentLanguageCode={currentLanguageCode}
        dispatch={dispatch}
        strings={strings}
      />
      <div className="header-offer  d-none d-lg-flex">
        <p>
          {currentLanguageCode === "en"
            ? footer?.main_banner.en
            : footer?.main_banner.ar}
        </p>
      </div>
    </div>
  );
};

HeaderTop.propTypes = {
  borderStyle: PropTypes.string,
  setCurrency: PropTypes.func,
  currency: PropTypes.object,
  currentLanguageCode: PropTypes.string,
  dispatch: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    currency: state.currencyData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrency: (currencyName) => {
      dispatch(setCurrency(currencyName));
    },
  };
};
// !DEL
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(multilanguage(HeaderTop));
