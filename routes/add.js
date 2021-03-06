const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

router.get("/", (request, response) => {
  response.status(200);
  response.render("add", {
    title: "Добавить курс",
    isAdd: true,
  });
});

router.post("/", async (request, response) => {
  const course = new Course({
    title: request.body.title,
    price: request.body.price,
    img: request.body.img,
    userId: request.user,
  });

  try {
    await course.save();
    response.redirect("/courses");
  } catch (error) {
    console.error(error);
    throw Error(error);
  }
});

module.exports = router;
