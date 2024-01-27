import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
import StarRating from "./StarRating";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
      color="blue"
      size={30}
      className="rating-style"
    />
    <StarRating maxRating={10} color="red" size={40} className="test" />
  </React.StrictMode>
);
