const express = require("express");
const app = express();
const users = require("./routes/users");
const posts = require("./routes/posts");

app.use("/users", users);
app.use("/posts", posts);

app.listen(3000, () => {
    console.log("server is listening...");

})