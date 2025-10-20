import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";

const BlogPost = ({ currentLanguageCode }) => {
  const [data, setData] = useState(null);
  const { id } = useParams(); // Get id from URL params

  // const navigate = useNavigate(); // React Router v6 navigation
console.log(id,'postid')
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/blog/${id}`);
        if (response?.data) {
          setData(response.data);
          console.log(response)
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]); // Re-fetch if id changes

  return (
    <Fragment>
      <div className="blog-details-top">
        {data ? (
          <>
            <div className="blog-details-img border">
              <img
                className="img-fluid w-100"
                src={data?.image_path}
                alt={
                  currentLanguageCode === "ar"
                    ? data?.translations?.[0]?.title || "No title"
                    : data?.translations?.[1]?.title || "No title"
                }
              />
            </div>
            <div className="blog-details-content">
              <div className="blog-meta-2">
                <ul>
                  <li>{data?.created_at}</li>
                </ul>
              </div>
              <h3>{data?.title}</h3>
              <p className="my-3 text-dark">
                {currentLanguageCode === "ar"
                  ? data?.translations?.[0]?.content || "No content"
                  : data?.translations?.[1]?.content || "No content"}
              </p>
            </div>
          </>
        ) : (
          <p>Loading post...</p>
        )}
      </div>
    </Fragment>
  );
};

BlogPost.propTypes = {
  currentLanguageCode: PropTypes.string,
};

export default multilanguage(BlogPost);
