import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";

const BannerFive = ({ strings, currentLanguageCode, className }) => {
  const [bannerData, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axiosInstance.get("/offers-banner");
        setBanners(response.data || []);
      } catch (error) {
        console.error("Error fetching banner data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBannerData();
  }, []);

  // Filter banners for main and others
  const mainBanner = bannerData?.find((banner) => banner.main === 1);
  const otherBanners = bannerData?.filter((banner) => banner.main !== 1);
  const d1 = otherBanners?.slice(0, 2); // first 2 banners
  const d2 = otherBanners?.slice(2, 4); // next 2 banners

  if (isLoading) {
    return <div className="loading-spinner" />;
  }

  // For SMALL screens, we only want to show 3 banners in order:
  // d1[0], d1[1], and mainBanner.
  const smallScreenBanners = [];
  if (d1?.[0]) smallScreenBanners.push(d1[0]);
  if (d1?.[1]) smallScreenBanners.push(d1[1]);
  if (mainBanner) smallScreenBanners.push(mainBanner);

  // Helper function to render a single banner
  const renderBanner = (banner, contentClass = "banner-content-3") => {
    if (!banner) return null;
    return (
      <div className="single-banner mb-30" key={banner.id}>
        <Link to={process.env.PUBLIC_URL + "/shop"}>
          <div className="banner-image-wrapper">
            <img src={banner.image_path} alt="Banner" loading="lazy" />
            <div className="overlay" />
          </div>
        </Link>
        <div className={contentClass}>
          <h3>
            {currentLanguageCode === "en"
              ? banner?.translations[1]?.title
              : banner?.translations[0]?.title}
          </h3>
          <p>
            {currentLanguageCode === "en"
              ? mainBanner?.translations[1]?.description
              : mainBanner?.translations[0]?.description}
          </p>
          <Link to={process.env.PUBLIC_URL + "/shop"} className="icon">
            <i className="fa fa-long-arrow-right" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className={`banner-area hm9-section-padding ${className}`}>
      {/* Outer .skew to angle everything */}
      <div className="skew">
        <div className="container-fluid">
          {/* 
            1) LARGE-SCREEN LAYOUT (≥ 992px)
               - Top row: 1st banner, main banner, 2nd banner
               - Bottom row: remaining banners
          */}
          <div className="d-lg-block">
            {/* Top row: 3 banners */}
            <div className="row">
              <div className="col-lg-4">{renderBanner(d1?.[0])}</div>
              <div className="col-lg-4 main">
                {mainBanner && (
                  <div className="single-banner mb-30" key={mainBanner.id}>
                    <Link to={process.env.PUBLIC_URL + "/shop"}>
                      <div className="banner-image-wrapper">
                        <img
                          src={mainBanner?.image_path}
                          alt="Banner"
                          loading="lazy"
                        />
                        <div className="overlay" />
                      </div>
                    </Link>
                    <div className="banner-content-4">
                      <span>
                        {currentLanguageCode === "en"
                          ? mainBanner?.translations[1]?.description
                          : mainBanner?.translations[0]?.description}
                      </span>
                      <h2 style={{ marginTop: "20px" }}>
                        {currentLanguageCode === "en"
                          ? mainBanner?.translations[1]?.title
                          : mainBanner?.translations[0]?.title}
                      </h2>
                      <Link
                        to={process.env.PUBLIC_URL + "/shop"}
                        style={{ backgroundColor: "white", color: "#010001" }}
                      >
                        {strings["shop_now"]}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-lg-4">{renderBanner(d1?.[1])}</div>
            </div>

            {/* Bottom row: 2 banners (with brick offset) */}
            <div className="row second-row justify-content-center">
              <div className="col-lg-4">{renderBanner(d2?.[0])}</div>
              <div className="col-lg-4">{renderBanner(d2?.[1])}</div>
            </div>
          </div>

     
       
        </div>
      </div>

      {/* SKEW + Layout styles */}
      <style jsx>{`
        .skew {
          transform: skewY(-2deg);
        }
        .single-banner {
          margin-bottom: 30px;
        }
          @media (max-width:992px){
          .main{
          order:3
          }
      }
        .banner-content-3,
        .banner-content-4 {
          padding: 20px;
        }
        @media (min-width: 992px) {
          .second-row {
            margin-left: 5%;
          }
        }
        .icon i {
          transition: color 0.3s ease;
        }
        .icon:hover i {
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default multilanguage(BannerFive);
