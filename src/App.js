import { useEffect, useState } from "react";
import { NavBar, Search, NumResult } from "./NavBar";
import { Main } from "./Main.js";
import { MovieList } from "./MovieList.js";
import { WatchedMovieList } from "./WatchedMovieList.js";
import { WatchedSummary } from "./WatchedSummary.js";
import { Box } from "./Box.js";
import StarRating from "./StarRating.js";

// const KEY = "f84fc31d";
const KEY = "47916d10";
export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
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

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
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
      handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
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
                onAddWatched={handleAddWatched}
                watched={watched}
              />
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchedMovieList
                  watched={watched}
                  handleDeleteWatched={handleDeleteWatched}
                />
              </>
            )}
          </>
        </Box>
      </Main>
    </>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [userRating, setUserRating] = useState("");

  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // const isWatched = false;
  const watchedImdbID = watched.map((movie) => movie.imdbID);
  const isWatched = watchedImdbID.includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      function comCallback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", comCallback);

      return function () {
        document.removeEventListener("keydown", comCallback);
      };
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title} `;

      // Clean up function
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section>
            {!isWatched ? (
              <div className="rating">
                <StarRating
                  maxRating={10}
                  size={24}
                  onSetRating={setUserRating}
                />
                {userRating > 0 ? (
                  <button className="btn-add" onClick={handleAdd}>
                    + Ass to list
                  </button>
                ) : null}
              </div>
            ) : (
              <p>
                You rated this movie {watchedUserRating} <span>⭐</span>.
              </p>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
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
