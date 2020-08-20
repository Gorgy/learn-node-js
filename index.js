const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const coursesRoutes = require("./routes/courses");
const cartRoutes = require("./routes/cart");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const dbUrl = require("./data/mongo");
const User = require("./models/user");

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(async (request, response, next) => {
  try {
    const user = await User.findById("5f342d3d1f2c2f0e8c2df79c");
    request.user = user;
    next();
  } catch (error) {
    console.log("Error", error);
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    const candidate = await User.findOne();

    if (!candidate) {
      const user = new User({
        email: "lcf-trane@live.ru",
        name: "Gorgy",
        cart: {
          items: [],
        },
      });

      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on PORT:${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
