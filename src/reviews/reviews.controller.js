const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


function reviewExists(req, res, next) {
    reviewsService
    .read(req.params.reviewId)
    .then((review) => {
        if (review) {
            res.locals.review = review;
            return next();
        }
        next({ status: 404, message: `Review cannot be found.` });
    })
    .catch(next);
}

async function update(req, res, next) {
  const reviewId = res.locals.review.review_id
    const updatedReview = {
      ...req.body.data,
      review_id: res.locals.review.review_id,
    };
    await reviewsService.update(updatedReview);
    const review = await reviewsService.getReviewWithCritic(reviewId);
    const fullReview = {
      "content": review.content,
      "created_at": review.created_at,
      "critic_id": review.critic_id,
      "critic": review.critics,
      "movie_id": review.movie_id,
      "review_id": review.review_id,
      "score": review.score,
      "updated_at": review.updated_at
    }
    res.json({ data: fullReview });
}

function destroy(req, res, next) {
    reviewsService
    .delete(res.locals.review.review_id)
    .then(() => res.sendStatus(204))
    .catch(next);
}


module.exports = {
    update: [reviewExists, update],
    delete: [reviewExists, destroy],
}