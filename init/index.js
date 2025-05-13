const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);

})

async function main() {
    await mongoose.connect(MONGO_URL)
}

const initDB = () => {
    listing.deleteMany({}).then(res => {
        console.log("prev data deleted..");
    }).catch(err => {
        console.log(err);
    });
    listing.insertMany(initData.data).then(res => {
        console.log("new data inserted..");
    }).catch(err => {
        console.log(err);
    });;
    console.log("data was initialized");
}
initDB();

