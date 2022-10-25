const { add } = require("lodash");
const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
    preferred_name: "critics.preferred_name",
    surname: "critics.surname",
    organization_name: "critics.organization_name"
});

function read(review_id) {
    return knex("reviews AS r").join("critics AS c", "r.critic_id", "c.critic_id").select("r.*",
      "c.critic_id as c_critic_id",
      "c.preferred_name",
      "c.surname",
      "c.organization_name",
      "c.created_at as c_created_at",
      "c.updated_at as c_updated_at").where({ review_id }).first().then(addCritic);
}
  
function update(updatedReview) {
    return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

function getReviewWithCritic(review_id) {
    return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ review_id: review_id })
    .first()
    .then((result) => {
      const review = addCritic(result)
      return review
    });
}


function destroy(review_id) {
    return knex("reviews").where({ review_id }).del();
}

module.exports = {
    read,
    update,
    delete: destroy,
    getReviewWithCritic
}