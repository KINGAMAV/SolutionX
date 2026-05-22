import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',

  // Auth
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-prod',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '24h',

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Payment
  MOBILE_MONEY_API_KEY: process.env.MOBILE_MONEY_API_KEY || '',
  STRIPE_API_KEY: process.env.STRIPE_API_KEY || '',
};

export default config;
