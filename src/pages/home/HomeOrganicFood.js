import React, { Fragment, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { multilanguage } from "redux-multilanguage";
import WOW from "wow.js";
import LayoutThree from "../../layouts/LayoutThree";
import BannerFive from "../../wrappers/banner/BannerFive";
import CountDownTwo from "../../wrappers/countdown/CountDownTwo";
import FeatureIconFour from "../../wrappers/feature-icon/FeatureIconFour";
import HeroSliderFive from "../../wrappers/hero-slider/HeroSliderFive";
import NewsletterTwo from "../../wrappers/newsletter/NewsletterTwo";
import TabProductFour from "../../wrappers/product/TabProductFour";
import CategoryNoSlider from "../../wrappers/category/CategoryNoSlider.js";
import TestimonialOne from "../../wrappers/testimonial/TestimonialOne";
import BlogFeaturedThree from "../../wrappers/blog-featured/BlogFeaturedThree.js";
import Categories from "../../components/categories/Categories.js";
import ParallaxEffect from "../other/parallexSection.js";
// import ParallaxSection from "./../other/parallexSection.js";



const HomeOrganicFood = ({ strings }) => {
  const [show, setShow] = React.useState(false);

  useEffect(() => {
    const wow = new WOW({
      boxClass: "wow", // default
      animateClass: "animated", // default
      offset: 1, // adjust as needed
      mobile: true, // enable animations on mobile
      live: true, // continuously check for new elements
    });
    wow.init();
  }, []);


  // useEffect(() => {
  //   // Delay the appearance after 2 seconds
  //   const timer = setTimeout(() => {
  //     setShow(true);
  //   }, 2000);

  //   return () => clearTimeout(timer); // Cleanup timer on unmount
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000); // تأخير 2 ثانية
    return () => clearTimeout(timer); // تنظيف التايمر عند تفكيك المكون
  }, []);

  return (
    <Fragment>
      <MetaTags>
        <title>{strings["StarSeven"]}</title>
        <meta
          name="description"
          content="Organic food home of StarSeven react minimalist eCommerce template."
        />
      </MetaTags>
      <LayoutThree
        headerTop="visible"
        headerContainerClass="container-fluid"
        headerBorderStyle="fluid-border"
        headerPaddingClass="header-padding-2"
      >
        <HeroSliderFive    className="wow fadeInUp"  />
        {show  &&<ParallaxEffect    className={`myElement ${show ? "show" : "hidden"}`} />}

        {/* <FeatureIconFour 
          spaceTopClass="pt-10" 
          spaceBottomClass="pb-20" 
          containerClass="container-fluid" 
          gutterClass="padding-10-row-col"
          className="wow fadeInUp" 
        /> */}
      <div className="home-handler">
        <Categories strings={strings} className="wow fadeInLeft" />
        <TabProductFour 
          spaceBottomClass="pb-100" 
          category="organic food" 
          productTabClass="product-tab-fruits" 
          className="wow fadeInRight" 
        />
        <BannerFive className="wow zoomIn" />
        {/* <CountDownTwo 
          spaceTopClass="pt-80" 
          spaceBottomClass="pb-95" 
          dateTime="November 13, 2020 12:12:00" 
          className="wow fadeIn" 
        /> */}
        <TestimonialOne 
          spaceTopClass="pt-70" 
          spaceBottomClass="pb-70" 
          bgColorClass="bg-gray-3" 
          className="wow fadeInUp" 
        />
        <NewsletterTwo 
          spaceTopClass="pt-70" 
          spaceBottomClass="pb-70" 
          subscribeBtnClass="" 
          className="wow fadeIn" 
        />
        <BlogFeaturedThree spaceBottomClass="pb-55" className="wow fadeIn" />
        </div>
      </LayoutThree>
    </Fragment>
  );
};

export default multilanguage(HomeOrganicFood);
