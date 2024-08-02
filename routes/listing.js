const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");

const { isLoggedIn, isOwner, validateListing } = require("../middleware");   

const router = express.Router();

const listingController = require("../controllers/listings.js")


router
    .route("/")
    .get( wrapAsync(listingController.index))
    .post( isLoggedIn ,validateListing, wrapAsync(listingController.createListing));


// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
    .get( wrapAsync(listingController.showListings))
    .put( isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;