const express = require("express");
const app = express();
const users = require("./routes/users");
const posts = require("./routes/posts");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretCode"));

app.get("/greet", (req, res) => {
    let { name = "anonymous" } = req.cookies;
    res.send(`Hi, ${name}`);
})

app.get("/getSignedCookies", (req, res) => {
    res.cookie("Made-In", "India", { signed: true });
    res.send("Signed cookies sent...");
})

app.get("/verify", (req, res) => {
    // console.log(req.cookies);
    console.log(req.signedCookies);
    res.send("verified");

})

app.get("/getcookies", (req, res) => {
    res.cookie("Greet", "Namaste");
    res.cookie("MadeIn", "India");
    res.send("Hey, sent some cookies");
})

app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hi, I am root...!");
})

app.use("/users", users);
app.use("/posts", posts);

app.listen(3000, () => {
    console.log("server is listening...");

})