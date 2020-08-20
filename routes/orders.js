const { Router } = require("express");
const Order = require("../models/order");
const router = Router();

router.get("/", async (request, response) => {
  try {
    const orders = await Order.find({
      "user.userId": request.user._id,
    }).populate("user.userId");

    response.render("orders", {
      isOrder: true,
      title: "Заказы",
      orders: orders.map((o) => ({
        ...o._doc,
        price: o.courses.reduce(
          (acc, c) => (acc += c.count * c.course.price),
          0
        ),
      })),
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/", async (request, response) => {
  try {
    const user = await request.user
      .populate("cart.items.courseId")
      .execPopulate();

    const courses = user.cart.items.map((i) => ({
      count: i.count,
      course: {
        ...i.courseId._doc,
      },
    }));

    const order = new Order({
      user: {
        name: request.user.name,
        userId: request.user,
      },
      courses,
    });

    await order.save();
    await request.user.clearCart();

    response.redirect("/orders");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
