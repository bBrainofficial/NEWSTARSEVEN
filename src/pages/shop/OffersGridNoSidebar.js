import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Paginator from "react-hooks-paginator";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import Loading from "../../components/Loading";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopProducts from "../../wrappers/product/ShopProducts";
import ShopTopbar from "../../wrappers/product/ShopTopbar";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

const OffersGridNoSidebar = ({ location, strings }) => {
  const [layout, setLayout] = useState("grid three-column");
  const [filterSortValue, setFilterSortValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allData, setAllData] = useState({
    newArrival: [],
    bestSeller: [],
    saleItems: [],
  });
  const [currentData, setCurrentData] = useState([]);
  const [activeTab, setActiveTab] = useState("newArrival");
  const pageLimit = 20;
  const [loading, setLoading] = useState(true);
  const { pathname } = location;
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    const paramRoute = new URLSearchParams(window.location.search)

    console.log(paramRoute)
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/offers");
        console.log(response)
        if (response.status === 200) {
          setData(response.data.data);
          console.log('offers', response.data)
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        console.log(data)
      }
    };
    fetchData()
  }, [])
  React.useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [newItems, bestItems, saleItems] = await Promise.all([
          axiosInstance.get("/new-items"),
          axiosInstance.get("/best-items"),
          axiosInstance.get("/sale-items"),
        ]);
        setAllData({
          newArrival: newItems.data || [],
          bestSeller: bestItems.data || [],
          saleItems: saleItems.data || [],
        });
      } catch (error) {
        console.error("Error fetching items:", error);
        setAllData({ newArrival: [], bestSeller: [], saleItems: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  React.useEffect(() => {
    setCurrentData(allData[activeTab].slice((currentPage - 1) * pageLimit, currentPage * pageLimit));
  }, [activeTab, allData, currentPage]);
  useEffect(() => {
    let sortedProducts = [...allData[activeTab]];

    // Apply sorting
    if (filterSortValue === "high-to-low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (filterSortValue === "low-to-high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    }

    // Apply pagination
    const paginatedProducts = sortedProducts.slice((currentPage - 1) * pageLimit, currentPage * pageLimit);
    setCurrentData(paginatedProducts);
  }, [activeTab, allData, currentPage, filterSortValue]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Fragment>
      <MetaTags>
        <title>{strings["offers"]}</title>
        <meta name="description" content="Offers page of eCommerce store." />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>{strings["home"]}</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>{strings["offers"]}</BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        <Breadcrumb />

        <div className="shop-area pt-95 pb-100">
          <div className="container">
            <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
              {/* <Nav variant="pills" className="product-tab-list pt-35 pb-60 text-center">
                <Nav.Item>
                  <Nav.Link eventKey="bestSeller"><h4>{strings["bestSellers"]}</h4></Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="newArrival"><h4>{strings["newArrivals"]}</h4></Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="saleItems"><h4>{strings["saleItems"]}</h4></Nav.Link>
                </Nav.Item>
              </Nav> */}
              <Tab.Content>
                <Tab.Pane eventKey={activeTab}>
                  <ShopTopbar
                    getLayout={setLayout}
                    getFilterSortParams={setFilterSortValue}
                    productCount={allData[activeTab]?.length || 0}
                    sortedProductCount={data?.length || 0}
                  />
                 <ShopProducts layout={layout} products={currentData} />

                  <div className="pro-pagination-style text-center mt-30">
                    <Paginator
                      totalRecords={allData[activeTab]?.length || 0}
                      pageLimit={pageLimit}
                      pageNeighbours={2}
                      setOffset={(offset) => setCurrentPage(Math.ceil(offset / pageLimit) + 1)}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      pageContainerClass="mb-0 mt-0"
                      pagePrevText="«"
                      pageNextText="»"
                    />

                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

OffersGridNoSidebar.propTypes = {
  location: PropTypes.object,
};

export default connect()(multilanguage(OffersGridNoSidebar));