import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/api";
import { multilanguage } from "redux-multilanguage";

const BlogPostsNoSidebar = ({ currentLanguageCode ,strings}) => {
  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/blogs");
        setBlogData(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Fragment>
      {blogData.map((post, key) => {
        const translation = post.translations.find(t => t.locale === currentLanguageCode) || post.translations[0];
        return (
          <div key={key} className="col-lg-4 col-md-6 col-sm-12">
            <div className="blog-wrap-2 mb-30">
              <div className="blog-img-2">
                <Link to={`/post/${post.id}`}>
                  <img src={post.image_path} alt={translation.title} />
                </Link>
              </div>
              <div className="blog-content-2">
                <div className="blog-meta-2">
                  <ul>
                    <li>{new Date(post.created_at).toLocaleDateString()}</li>
                  </ul>
                </div>
                <h4>
                  <Link to={`/post/${post.id}`}>{translation.title}</Link>
                </h4>
                <p>{translation.content.split(" ").slice(0, 15).join(" ")}...</p>
                <div className="blog-share-comment">
                  <div className="blog-btn-2">
                    <Link to={`/post/${post.id}`}>{strings["read_more"]}</Link>
                  </div>
                  <div className="blog-share">
                    <span>{strings["share"]} :</span>
                    <div className="share-social">
                      <ul>
                        <li><a className="facebook" href="//facebook.com"><i className="fa fa-facebook" /></a></li>
                        <li><a className="twitter" href="//twitter.com"><i className="fa fa-twitter" /></a></li>
                        <li><a className="instagram" href="//instagram.com"><i className="fa fa-instagram" /></a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Fragment>
  );
};

export default multilanguage(BlogPostsNoSidebar);
