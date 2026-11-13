import dotenv from 'dotenv';
dotenv.config();

// PORT is inherited from some shells/hosts and can legitimately be "0" (random port).
// A user-facing API server must bind a real, reachable port, so fall back to 5000
// whenever PORT is missing or not a positive integer.
function resolvePort(): number {
  const parsed = Number.parseInt(process.env.PORT || '', 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 5000;
}

export const config = {
  port: resolvePort(),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'truetransit_development_jwt_secret_key_987654321',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  demoMode: process.env.DEMO_MODE !== 'false',
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000').split(','),
};
