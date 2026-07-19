const router = require("express").Router();
const { trackNewClick, newLink, getAnalytics } = require("./controllers");

router.post("/links/:id", trackNewClick);
router.post("/links", newLink);

router.get("/links/:id", getAnalytics);

module.exports = router;
