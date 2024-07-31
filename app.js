const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");



const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

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

const sessionOptions = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

// Root Route
app.get("/", (req, res) => {
    res.send("Root Working");
})


// Middlewares
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    next();
})

app.get("/demouser", async (req, res)=>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username:"student",
    })
    let registeredUser = await User.register(fakeUser, "password");
    res.send(registeredUser);
})


// listings
app.use("/listings", listingRouter);

// Reviews
app.use("/listings/:id/reviews", reviewRouter);

// User

app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


// Error Handling Middleware
app.use((err, req, res, next) => {
    let { statusCode=500, message="Something Went Wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});


app.listen(8080, () =>console.log("listening to port 8080"))