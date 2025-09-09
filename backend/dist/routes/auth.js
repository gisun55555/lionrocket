"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/register', authController_1.AuthController.register);
router.post('/login', authController_1.AuthController.login);
router.post('/logout', authController_1.AuthController.logout);
router.get('/check-email', authController_1.AuthController.checkEmail);
router.get('/me', auth_1.authenticateToken, authController_1.AuthController.getMe);
exports.default = router;
//# sourceMappingURL=auth.js.map