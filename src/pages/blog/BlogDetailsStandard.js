import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";
import BlogPost from "../../wrappers/blog/BlogPost";
import { useLocation, useHistory } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import { useParams } from "react-router-dom";

const BlogDetailsStandard = ({ location, strings, currentLanguageCode }) => {

  const { id } = useParams(); // ✅ Extract post ID from URL path

  const { pathname } = location;
  const locationParam = useLocation();
  const history = useHistory();
  const [post, setPost] = useState(null);
  const [postIds, setPostIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all post IDs on component mount
  useEffect(() => {
    const fetchPostIds = async () => {
      try {
        const response = await axiosInstance.get("/blogs");
        const ids = response.data.map(post => post.id).sort((a, b) => a - b); // Sort IDs in descending order
        setPostIds(ids);
        console.log(ids)
      } catch (error) {
        console.error("Error fetching post IDs:", error);
      }
    };
    fetchPostIds();
  }, []);

  // Fetch post when ID changes
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/blog/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  const getTitle = () => {
    if (currentLanguageCode === "ar") {
      return post?.translations?.[0]?.title || post?.title || "Untitled";
    }
    return post?.translations?.[1]?.title || post?.title || "Untitled";
  };

  const getDescription = () => {
    if (currentLanguageCode === "ar") {
      return post?.translations?.[0]?.content || "";
    }
    return post?.translations?.[1]?.content || "";
  };

  const goToAdjacentPost = (direction) => {
    const currentId = Number(id); // ✅ Use id from useParams()
    const currentIndex = postIds.indexOf(currentId);
  
    if (currentIndex === -1) return;
  
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < postIds.length) {
      history.push(`/post/${postIds[newIndex]}`); // ✅ Correct navigation
    }
  };

  if (loading) {
    return <div className="StarSeven-preloader-wrapper"><div className="StarSeven-preloader"></div></div>;
  }

  // if (!post) {
  //   return null;
  // }

  const currentIndex = postIds.indexOf(post.id);
  const isFirstPost = currentIndex === 0;
  const isLastPost = currentIndex === postIds.length - 1;

  return (
    <Fragment>
      <MetaTags>
        <title>
          {strings["StarSeven"]} | {getTitle()}
        </title>
        <meta name="description" content={getDescription()} />
      </MetaTags>
      <BreadcrumbsItem to={`${process.env.PUBLIC_URL}/`}>{strings["home"]}</BreadcrumbsItem>
      <BreadcrumbsItem to={`${process.env.PUBLIC_URL}${pathname}`}>
       {strings["blog_post"]}
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row flex-row-reverse">
              <div className="col-lg-9">
                <div className="blog-details-wrapper ml-20">
                  <BlogPost data={post} currentLanguageCode={currentLanguageCode} />
                  <div className="next-previous-post">
                    <button 
                      onClick={() => goToAdjacentPost(-1)} 
                      className="btn"
                      disabled={isFirstPost}
                    >
                      <i className="fa fa-angle-left" /> {strings["prev_post"]}
                    </button>
                    <button 
                      onClick={() => goToAdjacentPost(1)}  
                      className="btn"
                      disabled={isLastPost}
                    >
                      {strings["next_post"]} <i className="fa fa-angle-right" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <BlogSidebar />
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

BlogDetailsStandard.propTypes = {
  location: PropTypes.object,
  strings: PropTypes.object,
  currentLanguageCode: PropTypes.string,
};

export default multilanguage(BlogDetailsStandard);