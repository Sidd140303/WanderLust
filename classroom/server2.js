const express = require("express");
const app = express();
const users = require("./routes/users");
const posts = require("./routes/posts");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysecretstring",
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    if (name === "anonymous") {
        req.flash("error", "user not registered");
    } else {
        req.flash("success", "user registered successfully");
    }
    res.redirect("/hello");
})

app.get("/hello", (req, res) => {
    // res.send(`hello, ${req.session.name}`);
    // console.log(req.flash("success"));
    res.render("page.ejs", { name: req.session.name });
})


// app.get("/count", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else
//         req.session.count = 1;
//     res.send(`You sent a request ${req.session.count} times`);
// })

// app.get("/test", (req, res) => {
//     res.send("test successfull");
// })

app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hi, I am session...!");
})

app.listen(3001, () => {
    console.log("server is listening...");

})