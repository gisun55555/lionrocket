"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static('uploads'));
app.get('/', (req, res) => {
    res.json({
        message: 'AI Chat Service API',
        version: '1.0.0',
        status: 'running'
    });
});
const auth_1 = __importDefault(require("./routes/auth"));
const characters_1 = __importDefault(require("./routes/characters"));
const upload_1 = __importDefault(require("./routes/upload"));
const messages_1 = __importDefault(require("./routes/messages"));
app.use('/api/auth', auth_1.default);
app.use('/api/characters', characters_1.default);
app.use('/api/upload', upload_1.default);
app.use('/api/messages', messages_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: '서버 내부 오류가 발생했습니다.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
app.use((req, res) => {
    res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
});
app.listen(PORT, () => {
    console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`📱 프론트엔드 URL: ${process.env.FRONTEND_URL}`);
    console.log(`🌍 환경: ${process.env.NODE_ENV}`);
});
//# sourceMappingURL=server.js.map