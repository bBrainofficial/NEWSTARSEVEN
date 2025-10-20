import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import "aos/dist/aos.css";
import AOS from "aos";
import { multilanguage } from "redux-multilanguage";
import SectionTitleThree from "../../components/section-title/SectionTitleThree";
import axiosInstance from "../../api/api";

AOS.init({
  duration: 1000,
  once: true,
});

const Categories = ({ strings, className, currentLanguageCode }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/cafes");
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={`categories-container ${className}`}>
      <SectionTitleThree titleText={strings["featuredCategories"]} positionClass="text-center" />

      <div className="pt-35">
        {data &&
          data.map((category, index) => {
            // Find the translation that matches the current language
            const translation = category.translations.find(
              (lang) => lang.locale === currentLanguageCode
            );
            // Default to the original name if translation is not found
            const categoryName = translation ? translation.name : category.name;

            return (
              <Link
                to={`shop?categorey=${category.id}`}
                key={category.id}
                className="category-row"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <div className="category-content">
                  <h3 className="category-title">{categoryName}</h3>
                  <span className="category-arrow">➝</span>
                </div>
                <div className="category-image-wrapper">
                  <img
                    src={category.logo_path}
                    alt={categoryName}
                    className="category-img"
                    loading="lazy"
                  />
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

Categories.propTypes = {
  currentLanguageCode: PropTypes.string,
  strings: PropTypes.object,
  className: PropTypes.string,
};

export default multilanguage(Categories);
