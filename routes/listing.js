const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const { listingSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError");
const listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//Index route
router.get("/", async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
})

//New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

//Show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const showListing = await listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { showListing });

}))

//Create route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing created...");
    res.redirect("/listing");
}))

//Edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const editListing = await listing.findById(id);
    res.render("listings/edit.ejs", { editListing });
}))

//Update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing updated...");

    res.redirect(`/listing/${id}`);
}))

//Delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted...");
    res.redirect("/listing");
}))

module.exports = router;