const express = require("express")
const { auth } = require("../middleware/authMiddleware");
const { sendMessage, allMessages } = require("../controller/messageController");

const router = express.Router()

router.route('/').post(auth, sendMessage)
router.route('/:chatId').get(auth, allMessages)

module.exports = router;