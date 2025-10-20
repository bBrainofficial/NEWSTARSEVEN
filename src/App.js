import PropTypes from "prop-types";
import React, { Suspense, lazy, useEffect ,useState,useRef} from "react";
import { BreadcrumbsProvider } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
import { Route, BrowserRouter as Router, Switch, NavLink } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { loadLanguages, multilanguage } from "redux-multilanguage";
import ScrollToTop from "./helpers/scroll-top";

import "animate.css";


const ProgressBar = () => {
  return (
    <div className="progress-bar-wrapper " style={{display:'flex',flexDirection:'column'}}>
      <img
        src="https://e-commerce.test.do-go.net/ar/images/5755174121337067c8ceba148f8.png"
        alt="Loading"
        className="progress-bar-spinner"
        style={{height:'200px'}}
        rel="preload" 
        loading="lazy"
      />
      <div className="progress-bar-container">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
};

// Home pages
const HomeOrganicFood = lazy(() => import("./pages/home/HomeOrganicFood"));

// Shop pages
const ShopGridNoSidebar = lazy(() => import("./pages/shop/ShopGridNoSidebar"));
const OffersGridNoSidebar = lazy(() => import("./pages/shop/OffersGridNoSidebar"));

// Blog pages
const BlogStandard = lazy(() => import("./pages/blog/BlogNoSidebar"));
const BlogDetailsStandard = lazy(() => import("./pages/blog/BlogDetailsStandard"));

// Product pages
const ProductFixedImage = lazy(() => import("./pages/shop-product/ProductFixedImage"));

// Other pages
const About = lazy(() => import("./pages/other/About"));
const Contact = lazy(() => import("./pages/other/Contact"));
const MyAccount = lazy(() => import("./pages/other/MyAccount"));
const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));

const Cart = lazy(() => import("./pages/other/Cart"));
const Wishlist = lazy(() => import("./pages/other/Wishlist"));
const Checkout = lazy(() => import("./pages/other/Checkout"));

const NotFound = lazy(() => import("./pages/other/NotFound"));

const FavIcon = lazy(() => import("./components/faviconComponent/favicon"));

const App = (props) => {
  const [isReady, setIsReady] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => {
    props.dispatch(
      loadLanguages({
        languages: {
          en: require("./translations/en.json"),
          ar: require("./translations/ar.json"),
        },
      })
    );
  }, []);
  useEffect(() => {
    // preloadPages();
    // props.dispatch(
    //   loadLanguages({
    //     languages: {
    //       en: require("./translations/en.json"),
    //       ar: require("./translations/ar.json"),
    //     },
    //   })
    // );
    timerRef.current = setTimeout(() => {
      setIsReady(true);
    }, 3000);
    return () => clearTimeout(timerRef.current);
  }, []);

  if (!isReady) {
    return <ProgressBar />;
  }
  return (
    <ToastProvider placement="bottom-left" transitionDuration={180} autoDismiss autoDismissTimeout={3000}>
      <BreadcrumbsProvider>
        <Router>
          <ScrollToTop>
            <Suspense fallback={<ProgressBar />}> {/* Use ProgressBar here */}
              <FavIcon />
              <Switch>
                <Route exact path="/" component={HomeOrganicFood} />
                <Route path="/shop" component={ShopGridNoSidebar} />
                <Route path="/offers" component={OffersGridNoSidebar} />
                <Route path="/blog" component={BlogStandard} />
                <Route path="/post/:id" component={BlogDetailsStandard} />
                <Route path="/product/:id" component={ProductFixedImage} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                <Route path="/my-account" component={MyAccount} />
                <Route path="/login-register" component={LoginRegister} />
                <Route path="/cart" component={Cart} />
                <Route path="/wishlist" component={Wishlist} />
                <Route path="/checkout" component={Checkout} />
                <Route path="*" component={NotFound} />
              </Switch>
            </Suspense>
          </ScrollToTop>
        </Router>
      </BreadcrumbsProvider>
    </ToastProvider>
  );
};

App.propTypes = {
  dispatch: PropTypes.func,
};

export default connect()(multilanguage(App));
