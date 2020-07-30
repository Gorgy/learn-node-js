const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

router.get("/", async (request, response) => {
  const courses = await Course.getAll();

  response.status(200);
  response.render("courses", {
    title: "Курсы",
    isCourses: true,
    data: courses,
  });
});

router.get("/:id", async (request, response) => {
  const course = await Course.getCurrent(request.params.id);
  response.render("course", {
    layout: "empty",
    title: `Курс ${course.title}`,
    course,
  });
});

router.get("/:id/edit", async (request, response) => {
  if (!request.query.allow) {
    return response.redirect("/");
  }
  const course = await Course.getCurrent(request.params.id);
  response.render("course-edit", { course });
});

router.post("/edit", async (request, response) => {
  await Course.update(request.body);
  response.redirect("/courses");
});

module.exports = router;
