import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/api.js";
import Container from "react-bootstrap/Container";
import { Row } from "react-bootstrap";
import CategoryNoSliderSingle from "../../components/category/CategoryNoSliderSingle.js";

const CategoryNoSlider = ({ spaceBottomClass }) => {
    const [loading, setLoading] = useState(true);
    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get("/cafes");
          setCategoryData(response.data || []); // Ensure response structure is correct 
          console.log('categories',response.data)         
          setLoading(false);
        } catch (err) {
          setLoading(false);
          console.error("Error fetching data:", err);
        }
      };
  
      fetchData();
    }, []);
  
    // Handle loading state
    if (loading) {
      return <div className="loading-spinner" />;
    }

  return (
    <div
      className={`collections-area ${spaceBottomClass ? spaceBottomClass : ""}`}
    >
      <Container>
        <Row>
          {categoryData &&
            categoryData.map((single, key) => {
              const isLast = key === categoryData.length - 1;
              return <CategoryNoSliderSingle data={single} key={key} isLast={isLast} />;
            })}
        </Row>
    </Container>
    </div>
  );
};

CategoryNoSlider.propTypes = {
  spaceBottomClass: PropTypes.string
};

export default CategoryNoSlider
