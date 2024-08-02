const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");  
const Listing = require("../models/listing");

const reviewController = require("../controllers/reviews.js")

// Post Review
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview))


// Delete Review Route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;