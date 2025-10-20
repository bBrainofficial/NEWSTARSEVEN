import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/api"; // Ensure this is the correct import for API calls

export default function ParallaxEffect() {
  const [offsetY, setOffsetY] = useState(0);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.pageYOffset);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/settings");
        console.log("API Response:", response);

        if (response.data.settings?.banner_image_path) {
          setBanner(response.data.settings.banner_image_path);
        } else {
          setBanner("https://placehold.co/600x400/EEE/31343C"); // Fallback image
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setBanner("https://placehold.co/600x400/EEE/31343C"); // Set fallback image on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ marginTop: "-7px" }}>
      <section className="icon-section">
        <div className="masked-banner">
          <div
            className="parallax-background"
            style={{
              background: `url(${banner}) center center / cover no-repeat`,
              transform: `translateY(${offsetY * 0.29}px)`,
              height: "100vh", // Adjust height as needed
              width: "100%", 
            }}
          />
        </div>
      </section>
    </div>
  );
}
