import { useEffect, useRef, useState } from "react";
import { Loader } from "./App";
import StarRating from "./StarRating";
import { useKey } from "./useKey";
// import { Movie } from "./MovieList";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );
        if (!res.ok)
          throw new Error(`Something went wrong with fetching movies!`);
        // const data = await res.json();
        const data = await res.json();
        if (data.Response === "False") throw new Error(data.Error);
        setMovies(data.Search);
        setError("");
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    // Calling fetching fn
    fetchMovies();
  }, [query]);

  return { movies, error, isLoading };
}

export function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} onSelectMovie={onSelectMovie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

export function Movie({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
        </p>
      </div>
    </li>
  );
}

export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
  setSelectedId,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      } catch (err) {
      } finally {
      }
    }

    getMovieDetails();
  }, [selectedId]);

  // const {
  //   Actors,
  //   Awards,
  //   BoxOffice,
  //   Country,
  //   DVD,
  //   Director,
  //   Genre,
  //   Language,
  //   Metascore,
  //   Plot,
  //   Poster,
  //   Production,
  //   Rated,
  //   Ratings,
  //   Released,
  //   Response,
  //   Runtime,
  //   Title,
  //   Type,
  //   Website,
  //   Writer,
  //   Year,
  //   imdbID,
  //   imdbRating,
  //   imdbVotes,
  // } = movie;

  const {
    Actors: actors,
    Director: director,
    Genre: genre,
    Plot: plot,
    Poster: poster,
    Released: released,
    Runtime: runtime,
    Title: title,
    Year: year,
    imdbRating,
  } = movie;

  const countRef = useRef(0);
  console.log(countRef);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

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
  }

  const watchedImdbID = watched.map((movie) => movie.imdbID);
  const isWatched = watchedImdbID.includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  useKey("Escape", onCloseMovie);

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
            <img src={poster} alt={`Poster of '${title}' movie`} />
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
                    + Add to list
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
            <p>Starring: {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
