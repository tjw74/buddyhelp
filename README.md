# BuddyHelp

A TaskRabbit-style marketplace for renting tools and offering help.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see .env.example)
4. Run database migrations: `npx prisma migrate dev`
5. Start development server: `npm run dev`

## Database

This app uses PostgreSQL with Prisma ORM. The database connection is configured via environment variables.

## Deployment

The app is configured for Vercel deployment with automatic database connection.

<!-- Updated for Postgres deployment -->

