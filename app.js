const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);

})

async function main() {
    await mongoose.connect(MONGO_URL)
}

app.get("/testListing", async (req, res) => {
    let sampleListing = new listing({
        title: "My new Villa",
        description: "By the beach",
        price: 1200,
        location: "Goa",
        country: "India"
    })
    await sampleListing.save();
    console.log("response saved");
    res.send("Successful testing");

})


app.get("/", (req, res) => {
    res.send("Started...");
})

app.listen(8080, () => {
    console.log("Server is listening...");

})
