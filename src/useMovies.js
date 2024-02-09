import { useState, useEffect } from "react";

// const KEY = "f84fc31d";
const KEY = "47916d10";

// 1. build custom hook and name as "useXxxx"
// 2. export default or simple export
// 3. a custom hook must contain one or more React hooks
// 4. add hooks for step 3
// 5. add the required arguments
// 6. retrun the data as [] or {}
// 7. Now we can call(use) our custom hook wit it's requirements

export function useMovies(
  query,
  {
    /* callbackFn */
  }
) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // handleCloseMovie();
      // callbackFn?.();

      const controller = new AbortController(); //Browser APIs

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(""); // reseting error
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error(`Something went wrong with fetching movies!`);
          // const res = await fetch(
          //   `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}`
          // );
          const data = await res.json();
          if (data.Response === "False") throw new Error(`${data.Error}`);
          setMovies(data.Search);
          setError(""); // reseting error
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
