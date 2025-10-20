import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/api.js";
const videoFallback = process.env.PUBLIC_URL + "/4249231-hd_1920_1080_24fps.mp4";


const HeroSliderFive = ({ spaceLeftClass, spaceRightClass, className }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/settings");
        console.log("API Response:", response);

        if (response.data.settings?.main_image_path) {
         setVideoUrl(response.data.settings.main_image_path);
         
          // setVideoUrl(videoFallback);
        } else {
          setVideoUrl(videoFallback); // Fallback video
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setVideoUrl(videoFallback); // Set fallback video on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`slider-area ${spaceLeftClass || ""} ${spaceRightClass || ""} ${className}`}>
      <div className="slider-active nav-style-1">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}>
            {/* Video Background */}
            <video autoPlay loop muted
              style={{
                width: "100%",
                height: "85vh", // Adjust height as needed
                objectFit: "cover",
                zIndex: 0,
              }}>
              <source src={videoUrl} type="video/mp4" />
            </video>

            {/* Overlay (optional for styling) */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.2)", // Optional overlay
              zIndex: 1,
            }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

HeroSliderFive.propTypes = {
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string,
};

export default HeroSliderFive;
