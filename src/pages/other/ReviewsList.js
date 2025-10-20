import React from 'react';
import { multilanguage } from "redux-multilanguage";

const ReviewsPage = ({ product, strings }) => {
  return (
    <div className="reviews-container mt-50">
      <h2>{strings['ReviewsList']}</h2>
      <div className="item-container">
        <div className="reviews-section" style={product.reviews.length<1?{padding:'0px'}:{}}>
          <ul className="reviews-list">
            {product.reviews?.map((review ,index)=> (
              <li key={review.id} className="review-item" style={index !== 0 ? { marginTop: '20px' } : {}}>
                <div className="review-header">
                  <span className="reviewer-initials">
                    {review.user.fname.charAt(0)}{review.user.lname.charAt(0)}
                  </span>
                  <span className="review-date">{review.created_at}</span>
                </div>
                <div className="review-rating">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span key={index} className={index < review.rate ? 'star filled' : 'star'}>★</span>
                  ))}
                </div>
                <p className="review-comment">{review.review}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default multilanguage(ReviewsPage);
