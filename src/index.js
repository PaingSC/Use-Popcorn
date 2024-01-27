import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
import StarRating from "./StarRating-practice";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
      color="blue"
      size={30}
      className="rating-style"
    /> */}
    <StarRating maxRating={3} />
    <StarRating maxRating={3} messages={["Bad", "Okay", "Good"]} />
  </React.StrictMode>
);
