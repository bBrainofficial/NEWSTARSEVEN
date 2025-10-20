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
import { useLocation } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

// Import react-slick slider and its CSS
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ShopGridNoSidebar = ({ strings, currentLanguageCode }) => {
  const [layout, setLayout] = useState("grid three-column");
  const [filterSortValue, setFilterSortValue] = useState("");
  const [all, setAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const pageLimit = 20;

  const [allData, setAllData] = useState([]); // All items from the API
  const [currentData, setCurrentData] = useState([]); // Paginated & filtered items
  const [loading, setLoading] = useState(true);
  const [activeTap, setActiveTap] = useState('all'); // Active tab for category selection
  const [categories, setCategories] = useState([]);
  const [currentSubCategory, setCurrentSubCategory] = useState(null); // Current active sub-category

  const location = useLocation();
  const { pathname } = location;
  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("categorey"); // Extract category from URL query params

  // Fetch categories dynamically based on category from URL
  // 🔄  Replace BOTH existing category / product effects with this block:
  useEffect(() => {
    // when there is *no* ?categorey param, we’re in "All products" mode
    if (!categoryFromURL) {
      setAll(true);
      return;
    }

    // otherwise fetch once and keep everything in state
    (async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.post("/sub_cafes/find", {
          id: categoryFromURL
        });

        // deduplicate by sub-cafe id
        const uniqueCats = data.filter(
          (cat, idx, self) =>
            idx === self.findIndex(c => c.data.id === cat.data.id)
        );
        setCategories(uniqueCats);

        // all items across all sub-cafes
        const everyItem = uniqueCats.flatMap(c => c.items || []);

        // filter by sub-category if one is active
        const filtered = currentSubCategory
          ? uniqueCats
            .filter(c => c.data.id === Number(currentSubCategory))
            .flatMap(c => c.items || [])
          : everyItem;

        setAll(false);          // we’re definitely not in “all=backend items” mode
        setAllData(filtered);
        setCurrentData(filtered.slice(0, pageLimit));
      } catch (err) {
        console.error("fetch error", err);
        setCategories([]);
        setAllData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [categoryFromURL, currentSubCategory, pageLimit]);

  // Fetch products based on selection
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        if (all) {
          const response = await axiosInstance.get("/items");
          if (response.data) {
            setAllData(response.data);
            setCurrentData(response.data.slice(offset, offset + pageLimit));
          }
        }
      } catch (error) {
        console.error("Error fetching all products:", error);
        setAllData([]);
      } finally {
        setLoading(false);
      }
    };
    if (all) {
      fetchAllProducts();
    }
  }, [all, offset]);

  useEffect(() => {
    const fetchProductsForCategory = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.post("/sub_cafes/find", { id: categoryFromURL });
        if (response.data) {
          const categoriesFromResponse = response.data;
          setCategories(categoriesFromResponse); // لضمان عرض الـ Tabs

          // اجلب كل العناصر من جميع الـ sub_cafes
          const allItems = categoriesFromResponse.flatMap(cat => cat.items || []);

          // إذا تم اختيار sub-category محددة، صفي فقط عناصرها
          const filteredItems = currentSubCategory
            ? categoriesFromResponse
              .filter(cat => cat.data.id === Number(currentSubCategory))
              .flatMap(cat => cat.items || [])
            : allItems;

          setCurrentData(filteredItems);
          setAllData(filteredItems);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setAllData([]);
      } finally {
        setLoading(false);
      }
    };

    if (!all) {
      fetchProductsForCategory();
    }
  }, [categoryFromURL, currentSubCategory, all]);

  // Sorting products based on the selected filter
  useEffect(() => {
    let sortedProducts = [...allData];
    if (filterSortValue === "high-to-low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (filterSortValue === "low-to-high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    }
    setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
  }, [filterSortValue, allData, offset]);

  // // Helper to get the translated category name
  // const getTranslatedCategoryName = (category) => {
  //   const translations = category.translations || [];
  //   const translation = translations.find(t => t.locale === currentLanguageCode) || translations[0];
  //   return translation ? translation.name : category.name;
  // };

  // Handling category tab selection
  const handleTabSelect = (id, event) => {
    // Prevent the click event from affecting the slider behavior
    event.stopPropagation();

    // Check if we are selecting the "All" tab
    if (id === "all") {
      setAll(true); // Select all products
      setCurrentSubCategory(null); // Reset sub-category filter
    } else {
      setAll(false); // Select a specific category
      setCurrentSubCategory(id); // Set the selected sub-category
    
    }

    setActiveTap(id); // Update the active tab
    setCurrentPage(1); // Reset to the first page
    setOffset(0); // Reset the pagination offset
  };
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',activeTap)

  // slider settings
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    centerMode: true,        // <- slick keeps the active slide centred
    centerPadding: "0",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } }
    ]
  };


  if (loading) {
    return <Loading />;
  }
  console.log(currentSubCategory)
  return (
    <Fragment>
      <MetaTags>
        <title>{strings["shop"]}</title>
        <meta name="description" content="Shop page of eCommerce store." />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>{strings["home"]}</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>{strings["shop"]}</BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="shop-area pt-30 pb-100">
          <div className="container">
            <Tab.Container activeKey={activeTap} onSelect={handleTabSelect}>
              {/* Wrap the category tabs in a react-slick slider */}

              <Slider {...sliderSettings} className="category-slider">
                {/* ---- ALL PRODUCTS FIRST ---- */}
                <div key="all" className="slide-wrapper">
                  <Nav variant="pills" className="product-tab-list text-center">
                    <Nav.Item>
                      <Nav.Link
                        eventKey="all"
                        active={activeTap === 'all'}
                        onClick={e => handleTabSelect("all", e)}
                      >
                        <h4 style={{ margin: 0 }}>{strings["allProducts"] || "All"}</h4>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>

                {/* ---- REAL CATEGORIES ---- */}
                {categories.map(cat => {
                  const {
                    id,
                    logo,
                    translations = [],
                    name: fallbackName
                  } = cat.data;
                  const t = translations.find(
                    t => t.locale === currentLanguageCode
                  ) || translations[0];
                  const catName = t ? t.name : fallbackName;
                  
                  return (
                    
                    <div key={id} className="slide-wrapper">
                    
                      <Nav variant="pills" className="product-tab-list text-center">
                        <Nav.Item>
                          <Nav.Link
                            eventKey={id}
                            active={parseInt(activeTap) === parseInt(id)}
                            onClick={e => handleTabSelect(parseInt(id), e)}
                             
                          >
                            {logo && (
                              <img
                                src={`https://e-commerce.test.do-go.net/images/${logo}`}
                                alt={catName}
                                style={{ width: 40, height: 40 }}
                              />
                            )}
                            <h4 style={{ marginTop: 12 }}>{catName}</h4>
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  );
                })}
              </Slider>

     


            </Tab.Container>
          </div>

          <div className="shop-area pt-95 pb-100">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <ShopTopbar
                    getLayout={setLayout}
                    getFilterSortParams={setFilterSortValue}
                    productCount={currentData.length}
                    sortedProductCount={currentData.length}
                  />
                  <ShopProducts layout={layout} products={currentData} />
                  <div className="pro-pagination-style text-center mt-30">
                    <Paginator
                      totalRecords={currentData.length}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

ShopGridNoSidebar.propTypes = {
  location: PropTypes.object,
  products: PropTypes.array,
};

export default connect()(multilanguage(ShopGridNoSidebar));
