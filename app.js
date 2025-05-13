const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

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
app.use(methodOverride("_method"));

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Goa",
//         country: "India"
//     })
//     await sampleListing.save();
//     console.log("response saved");
//     res.send("Successful testing");

// })

app.get("/listing", async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
})

//New Route
app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs")
})

//Show route
app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;
    const showListing = await listing.findById(id);
    res.render("listings/show.ejs", { showListing });

})

//Create route
app.post("/listing", async (req, res) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
})

//Edit route
app.get("/listing/:id/edit", async (req, res) => {
    let { id } = req.params;
    const editListing = await listing.findById(id);
    res.render("listings/edit.ejs", { editListing });
})

//Update route
app.put("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`);
})

//Delete route
app.delete("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
})

app.get("/", (req, res) => {
    res.send("Started..");
})

app.listen(8080, () => {
    console.log("Server is listening...");

})
