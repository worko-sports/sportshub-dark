# Deployment Guide (Vercel)

Your project is built with Next.js 14, Tailwind, and Prisma. It is ready for deployment, but requires a database switch.

## ⚠️ Important: Database Change Required
By default, this project uses **SQLite** (a local file). Cloud platforms like Vercel do not support SQLite files (your data will vanish). You must switch to **PostgreSQL**.

## Step-by-Step Deployment

### 1. Push to GitHub
Upload this project to a GitHub repository.

### 2. Create Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New > Project**.
3. Import your GitHub repository.
4. **DO NOT** click Deploy yet.

### 3. Add Database (PostgreSQL)
1. In your Vercel Project dashboard, go to the **Storage** tab.
2. Click **Create Database** -> Select **Postgres**.
3. Follow the steps (accept defaults).
4. Once created, Vercel will automatically add environment variables (`POSTGRES_PRISMA_URL`, etc.) to your project.

### 4. Update Code for PostgreSQL
You need to tell Prisma to use Postgres instead of SQLite.

1. Open `prisma/schema.prisma`.
2. Change the `datasource` block:
   ```prisma
   // OLD (SQLite)
   // datasource db {
   //   provider = "sqlite"
   //   url      = env("DATABASE_URL")
   // }

   // NEW (PostgreSQL)
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_PRISMA_URL") // Vercel uses this variable name
     directUrl = env("POSTGRES_URL_NON_POOLING") // Optional but recommended for migrations
   }
   ```
3. Commit and push this change to GitHub.

### 5. Deploy
Vercel will detect the push and redeploy automatically.
- The build command `npm run build` will run.
- The postinstall script `prisma generate` will run.
- Your app should be live!

## Troubleshooting
- **Database Connection Error**: Ensure you changed `provider = "postgresql"` in `schema.prisma`.
- **Tables Missing**: You might need to run `npx prisma db push` locally (using the Vercel connection string) or add a build command to sync the schema.
  - *Easy Fix*: Connect to your Vercel DB locally and run `npx prisma db push`.
