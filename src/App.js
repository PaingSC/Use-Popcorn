import { useEffect, useRef, useState } from "react";
// import { NavBar, Search, NumResult } from "./NavBar";
import { NavBar, NumResult } from "./NavBar";
import { Main } from "./Main.js";
import { MovieList } from "./MovieList.js";
import { WatchedMovieList } from "./WatchedMovieList.js";
import { WatchedSummary } from "./WatchedSummary.js";
import { Box } from "./Box.js";
import StarRating from "./StarRating.js";
// import { useMovies } from "./useMovies.js";
import { useLocalStorageState } from "./useLocalStorageState.js";
import { useKey } from "./useKey.js";
import { Test, Search, useMovies } from "./Test";

// const KEY = "f84fc31d";
const KEY = "47916d10";
export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  // const { movies } = useMovies(query, handleCloseMovie);

  // Accessing Local Storage
  const [watched, setWatched] = useLocalStorageState([], "watched");

  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(() => {
  //   const storedValue = localStorage.getItem("watched");
  //   console.log(storedValue);
  //   const storeList = JSON.parse(storedValue);
  //   console.log(storeList);
  //   // return storedValue
  //   return storeList;
  // });

  const handleSelectMovie = function (id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };

  // const handleCloseMovie = function () {
  //   setSelectedId(null);
  // };
  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // useEffect for local storage
  // useEffect(
  //   function () {
  //     localStorage.setItem("watched", JSON.stringify(watched));
  //   },
  //   [watched]
  // );

  return (
    <>
      <Test>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Test>

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

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

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

  // /* eslint-disable */
  // if (imdbRating > 8) const [isTop, setIsTop] = useState(true); // breaking rule no1
  // /* eslint-disable */ if (imdbRating > 8) return <p>Greatest ever!</p>; // early return makes the the hooks fewer

  // const [isTop, setIsTop] = useState(imdbRating > 8);
  // console.log(isTop);
  // useEffect(
  //   function () {
  //     setIsTop(imdbRating > 8);
  //   },
  //   [imdbRating]
  // );

  const isTop = imdbRating > 8;
  console.log(isTop);

  // const [avgRating, setAvgRating] = useState(0);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    // onCloseMovie();

    // setAvgRating(Number(imdbRating));
    // setAvgRating((avgRating) => (userRating + avgRating) / 2);
    // alert(avgRating);
  }

  // EventListener for "Escape" key
  useKey("Escape", onCloseMovie);
  // useEffect(
  //   function () {
  //     function comCallback(e) {
  //       if (e.code === "Escape") {
  //         onCloseMovie();
  //       }
  //     }
  //     document.addEventListener("keydown", comCallback);

  //     return function () {
  //       document.removeEventListener("keydown", comCallback);
  //     };
  //   },
  //   [onCloseMovie]
  // );

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
          {/* <p>{avgRating}</p> */}

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
