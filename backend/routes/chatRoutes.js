const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controller/chatController");

const router = express.Router();

router.route("/").post(auth, accessChat);
router.route("/").get(auth, fetchChats);
router.route("/group").post(auth, createGroupChat);
router.route("/rename").put(auth, renameGroup);
router.route("/groupremove").put(auth, removeFromGroup);
router.route("/groupadd").put(auth, addToGroup);

module.exports = router;