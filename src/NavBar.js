// import { type } from "@testing-library/user-event/dist/type";
import { useCallback, useEffect, useRef, useState } from "react";
import { useKey } from "./useKey";

// export function NavBar({ children }) {
//   return (
//     <nav className="nav-bar">
//       <Logo />
//       {children}
//     </nav>
//   );
// }

// export function Logo() {
//   return (
//     <div className="logo">
//       <span role="img">🍿</span>
//       <h1>usePopcorn</h1>
//     </div>
//   );
// }

export function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  // listening for "Enter" "keydown" event
  useKey("Enter", () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery(""); // For the initial render
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

export function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
