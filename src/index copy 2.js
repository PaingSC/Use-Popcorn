import React, { useState } from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
import StarRating from "./StarRating";

function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <>
      <StarRating onSetRating={setMovieRating} />
      <p>This movie is rated {movieRating} stars.</p>
    </>
  );
}

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
    <StarRating
      maxRating={10}
      color="red"
      size={40}
      className="test"
      defaultRating={3}
    />
    <Test />
  </React.StrictMode>
);
