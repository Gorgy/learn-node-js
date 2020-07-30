const { Router } = require("express");
const router = Router();

router.get("/", (request, response) => {
  response.status(200);
  response.render("index", {
    title: "Главная страница",
    isHome: true,
  });
});

module.exports = router;
