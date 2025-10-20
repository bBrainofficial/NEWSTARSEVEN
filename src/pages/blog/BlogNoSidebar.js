import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import Paginator from "react-hooks-paginator";
import axiosInstance from "../../api/api"; // Ensure you have an API service
import BlogPostsNoSidebar from "../../wrappers/blog/BlogPostsNoSidebar";
import Loading from "../../components/Loading";
import { multilanguage } from "redux-multilanguage";

const BlogNoSidebar = ({ location,strings }) => {
  const { pathname } = location;

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const pageLimit = 5; // Adjust based on how many posts per page

  // Data states
  const [allPosts, setAllPosts] = useState([]);
  const [currentPosts, setCurrentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch blog posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/blogs");
        if (response.status === 200) {
          setAllPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setAllPosts([]); // Ensure we handle errors properly
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Update paginated posts
  useEffect(() => {
    setCurrentPosts(allPosts.slice(offset, offset + pageLimit));
  }, [allPosts, offset]);

  return (
    <Fragment>
      <MetaTags>
        <title>{strings['blog']}</title>
        <meta name="description" content="Blog of StarSeven react minimalist eCommerce template." />
      </MetaTags>
      
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>{strings["home"]}</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>{strings["blog"]}</BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        
        <div className="blog-area pt-100 pb-100 blog-no-sidebar">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="mr-20">
                  <div className="row">
                    {loading ? <Loading /> : <BlogPostsNoSidebar posts={currentPosts} />}
                  </div>

                  {/* Pagination */}
                  {allPosts.length > pageLimit && (
                    <div className="pro-pagination-style text-center mt-30">
                      <Paginator
                        totalRecords={allPosts.length}
                        pageLimit={pageLimit}
                        pageNeighbours={2}
                        setOffset={setOffset}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageContainerClass="mb-0 mt-0"
                        pagePrevText="«"
                        pageNextText="»"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

BlogNoSidebar.propTypes = {
  location: PropTypes.object,
};

export default multilanguage(BlogNoSidebar);
