const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");

const { isLoggedIn, isOwner, validateListing } = require("../middleware");   

const router = express.Router();

const listingController = require("../controllers/listings.js");

const multer = require('multer')

const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })


router
    .route("/")
    .get(wrapAsync(listingController.index)) 
    .post(
        isLoggedIn,
        upload.single("listing[image][url]"),
        validateListing,
        wrapAsync(listingController.createListing)
    )


// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
    .get( wrapAsync(listingController.showListings))
    .put( isLoggedIn, isOwner,upload.single("listing[image][url]"), validateListing, wrapAsync(listingController.updateListing))
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;