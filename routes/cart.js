const { Router } = require("express");
const Cart = require("../models/cart");
const Course = require("../models/course");
const router = Router();

router.post("/add", async (request, response) => {
  const course = await Course.getCurrent(request.body.id);
  await Cart.add(course);
  response.redirect("/cart");
});

router.get("/", async (request, response) => {
  const cart = await Cart.fetch();

  response.status(200);
  response.render("cart", {
    title: "Корзина",
    isCart: true,
    courses: cart.courses,
    price: cart.price,
  });
});

router.delete("/remove", async (request, response) => {
  const cart = await Cart.remove(request.query.id);
  response.status(200).json(cart);
});

module.exports = router;
