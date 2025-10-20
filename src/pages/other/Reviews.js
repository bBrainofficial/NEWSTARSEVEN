import React, { useState } from 'react';
import axiosInstance from '../../api/api';
import { multilanguage } from "redux-multilanguage";
import { useToasts } from "react-toast-notifications";
const StarRating = ({ value, onChange, readOnly = false }) => {
  
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          style={{
            fontSize: '24px',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            cursor: readOnly ? 'default' : 'pointer',
            color: star <= value ? '#ffc107' : '#e4e5e9',
          }}
          onClick={() => !readOnly && onChange(star)}
          disabled={readOnly}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const ReviewsSection = ({ id, strings }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewer, setReviewer] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const { addToast } = useToasts();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewer.trim() || !comment.trim() || rating === 0) return;

    try {
      const data = {
        item_id: id,
        rate: rating,
        review: comment,
        reviewer: reviewer,
      };

      // Send POST request to the backend
      await axiosInstance.post('/review-item', data);
      addToast(strings["review_placed"], { appearance: "success" });
    //   try {
    //     await axiosInstance.post("/checkout", checkoutData);
    //     addToast(strings["order_placed"], { appearance: "success" });
    //     dispatch(deleteAllFromCart(addToast));
    //   } catch (error) {
    //     console.error("Checkout failed:", error);
    //     addToast(strings["checkout_failed"], { appearance: "error" });
    //   }
    // };
  
      // Update local state with the new review
      const newReview = {
        id: Date.now(),
        reviewer,
        comment,
        rating,
      };
      setReviews([newReview, ...reviews]);

      // Reset form fields
      setReviewer('');
      setComment('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
      addToast(strings["review_failed"], { appearance: "error" });
      // Optionally show error message to user
    }
  };

  return (
    <div className="container mt-5">
      <form className="review-form" onSubmit={handleSubmit}>
        <h2 >{strings['submitReview']}</h2>
        <input
          type="text"
          className="input review-input mt-3"
          placeholder={strings["yourName"]}
          value={reviewer}
          onChange={(e) => setReviewer(e.target.value)}
          required
        />
        <textarea
          className="textarea review-input mt-3"
          placeholder={strings["yourReview"]}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <div className="mt-3">
          <StarRating value={rating} onChange={setRating} />
        </div>
        <button type="submit" className="button btn mt-4 ml-auto float-right">
          {strings?.["submitReview"] || "Submit Review"}
        </button>

      </form>

      {/* <ul className="review-list mt-5">
          {reviews.map((review) => (
            <li key={review.id} className="review-item mb-4">
              <p><strong>{review.reviewer}</strong></p>
              <StarRating value={review.rating} readOnly={true} />
              <p className="mt-2">{review.comment}</p>
            </li>
          ))}
        </ul> */}
    </div>
  );
};
export default multilanguage(ReviewsSection);