const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function movieExists(req, res, next) {
    moviesService
    .read(req.params.movieId)
    .then((movie) => {
        if (movie) {
            res.locals.movie = movie;
            return next();
        }
        next({ status: 404, message: `Movie cannot be found.` });
    })
    .catch(next);
}

function read(req, res, next) {
    moviesService
    .read(req.params.movieId)
    .then((data) => res.json({ data }))
    .catch(next);
}

function readTheaterShowingMovie(req, res, next) {
    moviesService
    .readTheaterShowingMovie(req.params.movieId)
    .then((data) => res.json({ data }))
    .catch(next);
}

function readMovieReviewsAndCritic(req, res, next) {
    moviesService
    .readMovieReviewsAndCritic(req.params.movieId)
    .then((data) => res.json({ data }))
    .catch(next);
}

function list(req, res, next) {
    if (req.query.is_showing === "true") {
        moviesService
        .listMovieIsShowing()
        .then((data) => res.json({ data }))
        .catch(next);
    } else {
        moviesService
        .list()
        .then((data) => res.json({ data }))
        .catch(next);
    }
}



module.exports = {
    read: [movieExists, read],
    readTheaterShowingMovie: [movieExists, readTheaterShowingMovie],
    readMovieReviewsAndCritic: [movieExists, readMovieReviewsAndCritic],
    list: asyncErrorBoundary(list),
    
}