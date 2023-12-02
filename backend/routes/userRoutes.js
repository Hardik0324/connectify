const express = require("express") 
const {signup, login, allUsers} = require("../controller/userController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(signup).get(auth, allUsers)
router.route("/login").post(login)

module.exports = router 