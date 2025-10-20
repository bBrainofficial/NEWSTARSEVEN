import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";

const BlogSidebar = ({ currentLanguageCode }) => {
  const [blogFeaturedData, setBlogFeaturedData] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axiosInstance.get("/blogs");
        setBlogFeaturedData(response.data.slice(0, 5)); // Get latest 5 posts
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="sidebar-style">
      <div className="sidebar-widget">
        <h4 className="pro-sidebar-title">
          {currentLanguageCode === "ar" ? "المشاركات الأخيرة" : "Recent Posts"}
        </h4>
        <div className="sidebar-project-wrap mt-30">
          {blogFeaturedData.map((single, key) => {
            const translation =
              single.translations.find(t => t.locale === currentLanguageCode) || single.translations[0];

            return (
              <div key={key} className="single-sidebar-blog">
                <div className="sidebar-blog-img">
                  <Link to={`/post/${single?.id}`}>
                    <img src={single?.image_path} alt={translation?.title || "Blog Post"} />
                  </Link>
                </div>
                <div className="sidebar-blog-content">
                  <h4>
                    <Link to={`/post/${single?.id}`}>{translation?.title}</Link>
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default multilanguage(BlogSidebar);
