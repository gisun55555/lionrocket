# 라이언로켓 FE-채용과제

AI 캐릭터와의 실시간 채팅 서비스

## 프로젝트 개요

사용자가 직접 생성한 AI 캐릭터와 실시간으로 대화할 수 있는 웹 애플리케이션입니다. Claude AI를 활용하여 각 캐릭터의 고유한 성격과 지식을 바탕으로 자연스러운 대화를 제공합니다.

## 주요 기능

- **인증 시스템**: 이메일/비밀번호 기반 로그인
- **캐릭터 관리**: 기본 캐릭터 3개 + 사용자 생성 캐릭터
- **실시간 채팅**: Claude AI 기반 대화
- **이미지 업로드**: 캐릭터 썸네일 업로드
- **탭 동기화**: 여러 탭에서 동일한 대화 공유
- **반응형 디자인**: 모바일/데스크톱 대응
- **이미지 캐싱 최적화** (Base64, Blob URL 활용)
- **이미지 파일 크기 제한 및 포맷 검증**
- **다크모드**

## 기술 스택

### Frontend
- **Next.js 15** - App Router, 정적 페이지 생성
- **React 19** - 최신 React 기능 활용
- **TypeScript 5.9** - 타입 안전성
- **Tailwind CSS 4.0** - 유틸리티 기반 스타일링
- **shadcn/ui** - Radix UI 기반 컴포넌트
- **TanStack Query v5** - 서버 상태 관리

### Backend
- **Express.js** - RESTful API 서버
- **TypeScript** - 타입 안전성
- **SQLite + Prisma** - 데이터베이스 및 ORM
- **JWT** - 인증 토큰
- **Multer** - 파일 업로드
- **Claude API** - AI 대화 생성

## 프로젝트 구조

```
lion/
├── frontend/                 # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/             # App Router 페이지
│   │   │   ├── characters/  # 캐릭터 선택 페이지
│   │   │   ├── chat/        # 채팅 페이지
│   │   │   └── section/     # 페이지별 컴포넌트
│   │   └── shared/          # 공통 로직
│   │       ├── components/  # UI 컴포넌트
│   │       ├── hooks/       # 커스텀 훅
│   │       ├── types/       # 타입 정의
│   │       └── utils/       # 유틸리티
│   └── package.json
├── backend/                 # Express.js 백엔드
│   ├── src/
│   │   ├── controllers/     # API 컨트롤러
│   │   ├── services/        # 비즈니스 로직
│   │   ├── models/          # 데이터 모델
│   │   └── routes/          # API 라우트
│   ├── prisma/              # 데이터베이스 스키마
│   └── package.json
└── README.md
```

프론트 폴더구조 <br>
@shared 폴더로 모든 공통 로직을 중앙화했습니다.

재사용하지 않는 컴포너는 해당하는 app 폴더 하위 폴더 section에서 관리 하였습니다.

## 설치 및 실행

### 시스템 요구사항
- **Node.js**: 18.0.0 이상 (권장: 20.x LTS)
- **npm**: 9.0.0 이상
- **Claude API 키**: [Anthropic Console](https://console.anthropic.com/)에서 발급

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd lion
```

### 2. 백엔드 설정 및 실행
```bash
cd backend
npm install
cp .env.example .env
npm run dev:fresh
```

### 3. 프론트엔드 설정 및 실행
```bash
cd frontend
npm install
npm run dev
```

### 4. 접속 확인
`http://localhost:3000` 접속 후 `test@example.com` / `password123`으로 로그인

## 개발 스크립트

### 백엔드
```bash
npm run dev:fresh    # DB 초기화 + 개발 서버 실행
npm run db:reset     # DB만 초기화
```



