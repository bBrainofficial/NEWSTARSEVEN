import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import BlogFeaturedThreeSingle from "../../components/blog-featured/BlogFeaturedThreeSingle";
import SectionTitle from "../../components/section-title/SectionTitle";
import axios from "axios";
import axiosInstance from "../../api/api";

const BlogFeaturedThree = ({ spaceTopClass, spaceBottomClass ,className}) => {
    const [blogFeaturedData, setBlogFeaturedData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // get last 3 posts
    useEffect(() => {
      // fetch data from API
      const fetchItems = async () => {
        setIsLoading(true);
        try {
          const response = await axiosInstance("/blogs");
          console.log(response);
          
          const data = response.data.slice(0, 3);
          setBlogFeaturedData(data);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error("Error fetching items:", error);
        }
      }
      fetchItems();
    }, [])
  
    // Handle loading state
    if (isLoading) {
      return <div className="loading-spinner" />;
    }
  return (
    <div
      className={`blog-area ${spaceTopClass ? spaceTopClass : ""} ${className} ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="container">
        <SectionTitle
          titleText="OUR BLOG"
          positionClass="text-center"
          spaceClass="mb-55"
        />
        <div className="row">
          {blogFeaturedData.map(singlePost => {
            return (
              <BlogFeaturedThreeSingle
                singlePost={singlePost}
                key={singlePost.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

BlogFeaturedThree.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default BlogFeaturedThree;
