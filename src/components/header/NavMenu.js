import PropTypes from "prop-types";
import React from "react";
import { NavLink } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import { useMenu } from "../../helpers/menuContext"; // Import Menu Context

const NavMenu = ({ strings, menuWhiteClass, sidebarMenu }) => {
  const { menuOpen } = useMenu(); // Use the stored menu state

  return (
    <div
      className={`${
        sidebarMenu
          ? "sidebar-menu"
          : `main-menu ${menuWhiteClass ? menuWhiteClass : ""}`
      } ${menuOpen ? "menu-open" : ""}`}
    >
      <nav>
        <ul>
          <li>
            <NavLink exact to={process.env.PUBLIC_URL + "/"} activeClassName="active-link">
              {strings["home"]}
            </NavLink>
          </li>
          <li>
            <NavLink to={process.env.PUBLIC_URL + "/shop"} activeClassName="active-link">
              {strings["shop"]}
            </NavLink>
          </li>
          <li>
            <NavLink to={process.env.PUBLIC_URL + "/offers"} activeClassName="active-link">
              {strings["offers"]}
            </NavLink>
          </li>
          <li>
            <NavLink to={process.env.PUBLIC_URL + "/blog"} activeClassName="active-link">
              {strings["blog"]}
            </NavLink>
          </li>
          <li>
            <NavLink to={process.env.PUBLIC_URL + "/about"} activeClassName="active-link">
              {strings["about_us"]}
            </NavLink>
          </li>
          <li>
            <NavLink to={process.env.PUBLIC_URL + "/contact"} activeClassName="active-link">
              {strings["contact_us"]}
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
  sidebarMenu: PropTypes.bool,
  strings: PropTypes.object,
};

export default multilanguage(NavMenu);
