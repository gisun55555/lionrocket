"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../controllers/messageController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.post('/send', messageController_1.MessageController.sendMessage);
router.get('/conversations', messageController_1.MessageController.getAllConversations);
router.get('/conversations/:characterId', messageController_1.MessageController.getConversationHistory);
router.delete('/conversations/:characterId', messageController_1.MessageController.deleteConversation);
router.delete('/:messageId', messageController_1.MessageController.deleteMessage);
exports.default = router;
//# sourceMappingURL=messages.js.map