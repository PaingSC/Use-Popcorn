// import StarRating from "./StarRating";

import { useState } from "react";

// Styles
const containerStyle = {
  display: "flex",
  gap: "5px",
  alignItems: "center",
};

const starContainer = {
  display: "flex",
  gap: "5px",
};

const ratingTextStyle = {
  lineHeight: "1",
  margin: "0",
};
export default function StarRating({ maxRating = 10, messages = [] }) {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  return (
    <>
      <h1>Star Rating in Practice</h1>
      <div style={containerStyle}>
        <div style={starContainer}>
          {Array.from({ length: maxRating }, (_, i) => (
            <Star
              key={i}
              full={rating >= i + 1 || ""}
              onRate={() => setRating(i + 1)}
              onHoverEnter={() => {
                setTempRating(i + 1);
                console.log(tempRating);
              }}
              onHoverLeave={() => setTempRating(0)}
            />
          ))}
        </div>
        <div>
          <p style={ratingTextStyle}>
            {messages.length === maxRating
              ? messages[tempRating - 1 || rating - 1]
              : tempRating || rating || ""}
          </p>
        </div>
      </div>
    </>
  );
}

const starStyle = {
  cursor: "pointer",
};

function Star({ full, onRate, onHoverEnter, onHoverLeave }) {
  return (
    <span
      style={starStyle}
      onClick={onRate}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
    >
      {full ? "S#" : "S$"}
    </span>
  );
}
