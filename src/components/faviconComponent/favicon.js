import { useEffect, useState } from "react";
import axiosInstance from "../../api/api";

const Favicon = () => {
  const [faviconUrl, setFaviconUrl] = useState("");

  useEffect(() => {
    const fetchFavicon = async () => {
      try {
        const response = await axiosInstance.get("/settings");
        const data = response.data;
        if (data?.settings?.icon) {
          const cacheBuster = new Date().getTime(); // Prevent caching
          setFaviconUrl(`https://e-commerce.test.do-go.net/images/${data.settings.icon}?v=${cacheBuster}`);
        }
      } catch (error) {
        console.error("Error fetching favicon:", error);
      }
    };

    fetchFavicon();
  }, []);

  useEffect(() => {
    if (!faviconUrl) return;

    console.log("Setting favicon to:", faviconUrl);

    // Remove existing favicons
    const existingIcons = document.querySelectorAll("link[rel='icon']");
    existingIcons.forEach((icon) => icon.parentNode.removeChild(icon));

    // Create new favicon link
    const newLink = document.createElement("link");
    newLink.rel = "icon";
    newLink.href = faviconUrl;
    document.head.appendChild(newLink);
  }, [faviconUrl]);

  return null;
};

export default Favicon;
