import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS 설정 - 개발 환경에서는 모든 오리진 허용
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'http://localhost:3000'
    : true, // 개발 환경에서는 모든 오리진 허용
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 200
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 (업로드된 이미지) - CORS 헤더 포함
app.use('/uploads', (req, res, next) => {
  // CORS 헤더 설정 - 개발 환경에서는 모든 오리진 허용
  if (process.env.NODE_ENV === 'production') {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
  } else {
    res.header('Access-Control-Allow-Origin', '*'); // 개발 환경에서는 모든 오리진 허용
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // 캐시 헤더 설정
  res.header('Cache-Control', 'public, max-age=31536000'); // 1년 캐시
  
  next();
}, express.static('uploads'));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Chat Service API',
    version: '1.0.0',
    status: 'running'
  });
});

// API 라우트
import authRoutes from './routes/auth';
import characterRoutes from './routes/characters';
import uploadRoutes from './routes/upload';
import messageRoutes from './routes/messages';

app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);

// 에러 핸들링 미들웨어
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: '서버 내부 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 핸들링
app.use((req, res) => {
  res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
});

app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📱 프론트엔드 URL: ${process.env.FRONTEND_URL}`);
  console.log(`🌍 환경: ${process.env.NODE_ENV}`);
});
