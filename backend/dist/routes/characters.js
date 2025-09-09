"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const characterController_1 = require("../controllers/characterController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/default', characterController_1.CharacterController.getDefaultCharacters);
router.get('/check-name', auth_1.authenticateToken, characterController_1.CharacterController.checkNameExists);
router.get('/', auth_1.optionalAuth, characterController_1.CharacterController.getAllCharacters);
router.get('/user', auth_1.authenticateToken, characterController_1.CharacterController.getUserCharacters);
router.get('/:id', characterController_1.CharacterController.getCharacterById);
router.post('/', auth_1.authenticateToken, characterController_1.CharacterController.createCharacter);
router.put('/:id', auth_1.authenticateToken, characterController_1.CharacterController.updateCharacter);
router.delete('/:id', auth_1.authenticateToken, characterController_1.CharacterController.deleteCharacter);
exports.default = router;
//# sourceMappingURL=characters.js.map