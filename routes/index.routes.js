const router = require("express").Router();
const authRoutes = require("./auth.routes");

const formVideoRoutes = require('./formVideo.routes')
// const userProfile = require('./userProfile');

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRoutes);
router.use('/formvideo', formVideoRoutes)

module.exports = router;
