const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema.js")
const listing = require("../models/listing.js");
const Review = require("../models/review.js");


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

//Reviews Post route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    console.log(req.body);

    let listingId = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review)
    listingId.reviews.push(newReview);

    await newReview.save();
    await listingId.save();
    console.log("New review saved");
    req.flash("success", "New review created...");
    res.redirect(`/listing/${listingId._id}`)
}))

//Delete review route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted...");
    res.redirect(`/listing/${id}`)
}))

module.exports = router;