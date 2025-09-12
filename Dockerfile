# 1️⃣ Build Stage
FROM node:24-alpine AS builder

WORKDIR /app

# package.json, yarn.lock 먼저 복사 (캐시 최적화)
COPY package.json yarn.lock ./

# 의존성 설치 (devDependencies 포함)
RUN yarn install --frozen-lockfile

# 소스 코드 복사
COPY . .

# 타입스크립트 빌드 (예: tsup/esbuild/tsc)
RUN yarn build


# 2️⃣ Runtime Stage
FROM node:24-alpine

WORKDIR /app

# package.json, yarn.lock 복사
COPY package.json yarn.lock ./

# 프로덕션 의존성만 설치
RUN yarn install --frozen-lockfile --production

# 빌드된 결과만 복사
COPY --from=builder /app/dist ./dist

# 실행
CMD ["node", "dist/index.js"]