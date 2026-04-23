import { loadEnv, defineConfig, Modules } from "@medusajs/framework/config";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:3000",
      authCors: process.env.AUTH_CORS || "http://localhost:3000",
      jwtSecret: process.env.JWT_SECRET || "connect-barcodes-jwt-secret-change-in-prod",
      cookieSecret: process.env.COOKIE_SECRET || "connect-barcodes-cookie-secret-change-in-prod",
    },
  },
  admin: {
    disable: false,
    backendUrl: process.env.BACKEND_URL || "http://localhost:9000",
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_SECRET_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              upload_dir: "static",
              backend_url: `${process.env.BACKEND_URL || "http://localhost:9000"}/static`,
            },
          },
        ],
      },
    },
    {
      resolve: "./src/modules/b2b-pricing",
    },
  ],
});
