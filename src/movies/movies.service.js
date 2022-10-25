const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");
const moviesController = require("./movies.controller");

const addCritic = mapProperties({
    preferred_name: "critics.preferred_name",
    surname: "critics.surname",
    organization_name: "critics.organization_name",
});

async function list() {
    return await knex("movies").select("*");
}

async function listMovieIsShowing() {
    return await knex("movies")
    .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
    .select("movies.*")
    .where({ "is_showing": true }).distinct();
}

async function read(movieId) {
    const movie = await knex("movies").select("*").where({ movie_id: parseInt(movieId) }).first();
    return movie;
}

async function readTheaterShowingMovie(movieId) {
    return knex("movies_theaters")
    .join("theaters", "movies_theaters.theater_id", "theaters.theater_id")
    .select("theaters.*")
    .where({ "movies_theaters.movie_id": movieId });
}

async function readMovieReviewsAndCritic(movieId) {
    return await knex("reviews")
    .join("critics", "critics.critic_id", "reviews.critic_id")
    .select("*")
    .where({ "reviews.movie_id": movieId })
    .then((result) => {
      const results = result.map((review) => {
        const reviewWithCritic = addCritic(review);
        const newObject = {};
        delete Object.assign(newObject, reviewWithCritic, {["critic"]: reviewWithCritic["critics"] })["critics"];
        return newObject;
      })
      return results
    });
}



module.exports = {
    list,
    listMovieIsShowing,
    read,
    readTheaterShowingMovie,
    readMovieReviewsAndCritic,
}