const express = require("express");
require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();

//passport config
require("./config/passport")(passport);

//db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connection Successful"))
  .catch((err) => console.log(err));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//bodyParser
app.use(express.urlencoded({ extended: false }));

//Express -session
app.use(
  session({
    secret: "secret",
    resave: true, //says should we re-save our session variables. for now we save it so set as true.
    saveUninitialized: true, //says do you want to save empty value in the session, we set it as true for now.
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variables
//we want to show green message for success and red for errors so we customised our own middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT} `));
