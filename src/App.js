import { useEffect, useState } from "react";
import { NavBar, Search, NumResult } from "./NavBar";
import { Main } from "./Main.js";
import { MovieList } from "./MovieList.js";
import { WatchedMovieList } from "./WatchedMovieList.js";
import { WatchedSummary } from "./WatchedSummary.js";
import { Box } from "./Box.js";

// const KEY = "f84fc31d";
const KEY = "47916d10";
export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  // const [movies, setMovies] = useState(tempMovieData);
  // const [watched, setWatched] = useState(tempWatchedData);
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleSelectMovie = function (id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };

  const handleCloseMovie = function () {
    setSelectedId(null);
  };

  // useEffect(function () {
  //   fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  //     .then((res) => res.json())
  //     .then((data) => setMovies(data.Search));
  // }, []);
  /*
// useEffest with dependancies
  useEffect(function () {
    console.log("1: After initial render");
  }, []);

  useEffect(function () {
    console.log("2: After every render");
  });

  useEffect(
    function () {
      console.log("3: Initial render and when update 'query' Prop!");
    },
    [query]
  );

  console.log("4: During every render");
*/

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(""); // reseting error
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );
          console.log(res);
          if (!res.ok)
            throw new Error(`Something went wrong with fetching movies!`);
          // const res = await fetch(
          //   `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}`
          // );
          const data = await res.json();
          if (data.Response === "False") throw new Error(`${data.Error}`);
          setMovies(data.Search);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      console.log(query);
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          <>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
              />
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchedMovieList watched={watched} />
              </>
            )}
          </>
        </Box>
      </Main>
    </>
  );
}

function MovieDetails({ selectedId, onCloseMovie }) {
  return (
    <div className="details">
      <button className="btn-back" onClick={onCloseMovie}>
        &larr;
      </button>
      {selectedId}
    </div>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}
