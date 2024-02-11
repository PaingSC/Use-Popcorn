import { useEffect, useRef, useState } from "react";

export function Test({ children }) {
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
  const inputEl = useRef(null);

  useEffect(() => {
    // For initial render
    inputEl.current.focus();

    // For "Enter Key"
    document.addEventListener("keydown", handleKeydown);
    return document.addEventListener("keydown", handleKeydown);

    function handleKeydown(e) {
      if (e.code === "Enter") {
        if (document.activeElement === inputEl.current) return;
        inputEl.current.focus();
        setQuery("");
      }
    }
  }, [setQuery]);

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

// const KEY = "f84fc31d";
const KEY = "47916d10";

export function useMovies(query, {}) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        console.log("Fetching movies...");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );
        console.log(res);
      } catch (err) {
      } finally {
        console.log("Finally");
      }
    }

    // Calling fetching fn
    fetchMovies();
  }, []);

  return { movies };
}
