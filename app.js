const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/Listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema}= require("./schema")

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => console.log("connected to DB")).catch(err => { console.log(err) });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const validateListing = () => {
    let {error} = listingSchema.validate(req, res);
    console.log(result);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Root Route
app.get("/", (req, res) => {
    res.send("Root Working");
})

// Index Route
app.get("/listings",validateListing,wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

// Create Route
app.post("/listings",validateListing, wrapAsync(async (req, res) => {
    
    const newListing = new Listing(req.body.listing);
    newListing.save();
    res.redirect("/listings");
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`)
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect(`/listings`)
}));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {
    let { statusCode=500, message="Something Went Wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs", { message });
});


app.listen(8080, () =>console.log("listening to port 8080"))