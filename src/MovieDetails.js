import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating.js";
import { useKey } from "./useKey.js";
import { KEY, Loader } from "./App.js";

export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
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
  // console.log(isTop);
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
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
