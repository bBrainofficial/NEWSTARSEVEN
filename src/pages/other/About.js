import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import SectionTitleWithText from "../../components/section-title/SectionTitleWithText";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const TextGridOne = ({ spaceBottomClass, currentLanguageCode, strings }) => {
  const [mediaData, setMediaData] = useState([]); // Stores images/videos
  const [aboutContent, setAboutContent] = useState(null); // About Us Text Content
  const [loading, setLoading] = useState(true);
  const mediaHeight = "300px"; // ✅ Fixed height for all media

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axiosInstance.get("/about-images");
        if (response.status === 200) {
          setMediaData(response.data);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    const fetchAboutText = async () => {
      try {
        const response = await axiosInstance.get("/about");
        if (response.data) {
          console.log("API Response:", response.data); // Debugging
          console.log("Current Language Code:", currentLanguageCode); // Debugging
    
          const aboutData = response.data.about_us;
          const selectedText = aboutData[currentLanguageCode] || aboutData.en;
    
          setAboutContent(selectedText);
        }
      } catch (error) {
        console.error("Error fetching about us content:", error);
      }
    };
    
    // Run both API calls in parallel & set loading state
    setLoading(true);
    Promise.all([fetchMedia(), fetchAboutText()]).finally(() => setLoading(false));
  }, [currentLanguageCode]); // ✅ Ensures content updates when language changes
  

  return (
    <Fragment>
      {/* ✅ Meta Tags for SEO */}
      <MetaTags>
        <title>{`${strings["StarSeven"]} | ${strings["about_us"]}`}</title>
        <meta
          name="description"
          content={
            strings["about_page_description"] ||
            "About page of StarSeven eCommerce template."
          }
        />
      </MetaTags>

      {/* ✅ Breadcrumb Navigation */}
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>{strings["home"]}</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/about"}>{strings["about_us"]}</BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        <Breadcrumb />

        {/* ✅ About Us Section */}
        {loading ? (
          <div className="loading-spinner" />
        ) : (
          <SectionTitleWithText
            allData={{ about_us: aboutContent }}
            spaceTopClass="pt-100"
            spaceBottomClass="pb-95"
          />
        )}

        {/* ✅ Media Section (Images & Videos) */}
        <div className={`about-mission-area ${spaceBottomClass || ""}`}>
          <div className="container text-center">
            {loading ? (
              <div className="loading-spinner" />
            ) : (
              <div className="row text-center">
                {mediaData.map((item, index) => (
                  <div key={index} className="col-lg-4 col-md-4 mb-50">
                    <div className="single-mission mb-30 p-1 text-left media-container">
                      {item.image_path.endsWith(".mp4") ? (
                        <video
                          src={item.image_path}
                          controls
                          className="media-element"
                          style={{ height: mediaHeight, width: "100%" }}
                        />
                      ) : (
                        <img
                          src={item.image_path}
                          alt="image_about"
                          className="media-element"
                          style={{ height: mediaHeight, width: "100%", objectFit: "cover" }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

TextGridOne.propTypes = {
  spaceBottomClass: PropTypes.string,
  currentLanguageCode: PropTypes.string,
  strings: PropTypes.object
};

export default multilanguage(TextGridOne);