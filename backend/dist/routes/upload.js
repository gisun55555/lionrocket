"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileController_1 = require("../controllers/fileController");
const auth_1 = require("../middleware/auth");
const fileUpload_1 = require("../utils/fileUpload");
const router = (0, express_1.Router)();
router.post('/image', auth_1.authenticateToken, fileUpload_1.multerConfig.single('thumbnail'), fileController_1.FileController.uploadImage);
router.post('/preview', auth_1.authenticateToken, fileUpload_1.multerConfig.single('thumbnail'), fileController_1.FileController.getImagePreview);
router.delete('/image', auth_1.authenticateToken, fileController_1.FileController.deleteImage);
exports.default = router;
//# sourceMappingURL=upload.js.map