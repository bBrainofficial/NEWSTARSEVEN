import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import axiosInstance from "./../../api/api";
import HeaderTop from "../../components/header/HeaderTop";
import IconGroup from "../../components/header/IconGroup";
import Logo from "../../components/header/Logo";
import MobileMenu from "../../components/header/MobileMenu";
import NavMenu from "../../components/header/NavMenu";

const HeaderOne = ({
  layout,
  borderStyle,
  headerPaddingClass,
  headerPositionClass,
  headerBgClass,
}) => {
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [user, setUser] = useState(null);

  // Set up the sticky header scroll handler.
  useEffect(() => {
    const header = document.querySelector(".sticky-bar");
    setHeaderTop(header.offsetTop);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  // Fetch user data (including points) when the component mounts.
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axiosInstance.get("/user");
          // Assuming the response data looks like: { user: { points: 123, ... } }
          const { user } = response.data;
          console.log(user)
          setUser(user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }, []);

  return (
    <header
      className={`header-area clearfix ${headerBgClass ? headerBgClass : ""} ${
        headerPositionClass ? headerPositionClass : "" 
      } `}
    
    >
      <div
        className={`${headerPaddingClass ? headerPaddingClass : ""} header-top-area ${
          borderStyle === "fluid-border" ? "border-none" : ""
        } ${scroll > headerTop ? "stickTop stick" : ""} sticky-bar`}
        style={{minHeight:'50px',display:"flex",alignItems:'center'}}
      >
        <div className={layout === "container-fluid" ? layout : "container"}>
          {/* header top */}
          <HeaderTop borderStyle={borderStyle} />
        </div>
      </div>

      <div
        className={`${headerPaddingClass ? headerPaddingClass : ""} sticky-bar header-res-padding clearfix ${
          scroll > headerTop ? "stick" : ""
        }`}
        style={{ background: "#FFF" }}
      >
        <div className={layout === "container-fluid" ? layout : "container"}>
          <div className="row">
            <div
              className="col-xl-2 col-lg-2 col-md-6 col-4"
              style={{ margin: "auto", paddingInlineStart: "0px" }}
            >
              {/* header logo */}
              <Logo imageUrl="/assets/img/logo/logo.png" logoClass="logo" />
            </div>
            <div className="col-xl-7 col-lg-7 d-none d-lg-block">
              {/* Nav menu */}
              {/* You can pass the whole user object or just user.points */}
              <NavMenu user={user} />
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-8">
              {/* Icon group updated with user points */}
              <IconGroup userPoints={user ? user.points : 0} />
            </div>
          </div>
        </div>
        {/* mobile menu */}
        <MobileMenu />
      </div>
    </header>
  );
};

HeaderOne.propTypes = {
  borderStyle: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string,
  layout: PropTypes.string,
  top: PropTypes.string,
};

export default HeaderOne;
