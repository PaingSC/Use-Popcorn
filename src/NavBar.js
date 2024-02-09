import { type } from "@testing-library/user-event/dist/type";
import { useCallback, useEffect, useRef, useState } from "react";

export function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

export function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

export function Search({ query, setQuery }) {
  // const [query, setQuery] = useState("");
  // useEffect(() => {
  //   const el = document.querySelector(".search");
  //   console.log(el);
  //   el.focus();
  // }, []);

  const inputEl = useRef(null);

  useEffect(
    function () {
      inputEl.current.focus(); // For the initial render

      // For the enter key
      const useCallback = (e) => {
        if (document.activeElement === inputEl.current) return;
        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
        console.log(e);
      };
      document.addEventListener("keydown", useCallback);

      return document.addEventListener("keydown", useCallback);
      // inputEl.current.focus();
    },
    [setQuery]
  );

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
