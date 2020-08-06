const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

router.get("/", async (request, response) => {
  const courses = await Course.find();

  response.status(200);
  response.render("courses", {
    title: "Курсы",
    isCourses: true,
    courses,
  });
});

router.get("/:id", async ({ params }, response) => {
  const { id } = params;
  const course = await Course.findById(id);
  response.render("course", {
    layout: "empty",
    title: `Курс ${course.title}`,
    course,
  });
});

router.get("/:id/edit", async ({ params, query }, response) => {
  const { id } = params;
  const { allow } = query;
  if (!allow) {
    return response.redirect("/");
  }
  const course = await Course.findById(id);
  response.render("course-edit", { course });
});

router.post("/edit", async ({ body }, response) => {
  const { id, ...rest } = body;
  await Course.findByIdAndUpdate(id, rest);
  response.redirect("/courses");
});

module.exports = router;
