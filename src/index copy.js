import React from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./StarRating-practice";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StarRating maxRating={3} />
    <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
      size={25}
      color="aqua"
    />
    <StarRating
      maxRating={3}
      messages={["Bad", "Okay", "Good"]}
      color="blue"
      size={30}
      className="star-rating"
    />
  </React.StrictMode>
);
