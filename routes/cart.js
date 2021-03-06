const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

const mapCartItems = (cart) => {
  return cart.items.map((i) => ({
    ...i.courseId._doc,
    count: i.count,
    id: i.courseId.id,
  }));
};

const computePrice = (courses) =>
  courses.reduce((acc, item) => acc + item.price * item.count, 0);

router.post("/add", async (request, response) => {
  const course = await Course.findById(request.body.id);
  await request.user.addToCart(course);
  response.redirect("/cart");
});

router.get("/", async (request, response) => {
  const user = await request.user
    .populate("cart.items.courseId")
    .execPopulate();

  const courses = mapCartItems(user.cart);
  const price = computePrice(courses);

  response.status(200);
  response.render("cart", {
    title: "Корзина",
    isCart: true,
    courses,
    price,
  });
});

router.delete("/remove", async (request, response) => {
  await request.user.removeFromCart(request.query.id);
  const user = await request.user
    .populate("cart.items.courseId")
    .execPopulate();

  const courses = mapCartItems(user.cart);
  const price = computePrice(courses);

  response.status(200).json({
    courses,
    price,
  });
});

module.exports = router;
