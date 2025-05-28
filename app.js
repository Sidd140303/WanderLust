const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema.js");
// const listing = require("./models/listing.js");



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);

})

async function main() {
    await mongoose.connect(MONGO_URL)
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/listing", async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
})


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    // console.log(err);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    // console.log(err);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}



//New Route
app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs")
})

//Show route
app.get("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const showListing = await listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { showListing });

}))

//Create route
app.post("/listing", validateListing, wrapAsync(async (req, res, next) => {

    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
}))

//Edit route
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const editListing = await listing.findById(id);
    res.render("listings/edit.ejs", { editListing });
}))

//Update route
app.put("/listing/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`);
}))

//Delete route
app.delete("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
}))

//Reviews Post route
app.post("/listing/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    console.log(req.body);

    let listingId = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review)
    listingId.reviews.push(newReview);

    await newReview.save();
    await listingId.save();
    console.log("New review saved");
    res.redirect(`/listing/${listingId._id}`)
}))

//Delete review route
app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`)
}))

app.get("/", (req, res) => {
    res.send("Started..");
})

// app.all("*", (req, res, next) => {
//     console.log(req.path);

// });


app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs", { err });
})

app.listen(8080, () => {
    console.log("Server is listening...");

})
