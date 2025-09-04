import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// 현재 환경
const isProd = process.env.NODE_ENV != "dev";

// 로그 폴더 생성 (prod일 때만 필요)
const logDir = "logs";

// 공통 포맷
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// transports 설정
const loggerTransports = isProd
  ? [
      new DailyRotateFile({
        dirname: logDir,
        filename: "%DATE%.log", // 예: 2025-09-04.log
        datePattern: "YYYY-MM-DD",
        zippedArchive: false,
        maxSize: "20m", // 파일당 최대 크기
        maxFiles: "14d", // 보관 기간
      }),
    ]
  : [
      new transports.Console(), // dev, test 환경 → 콘솔만
    ];

const logger = createLogger({
  level: isProd ? "info" : "debug",
  format: logFormat,
  transports: loggerTransports,
});

export default logger;
