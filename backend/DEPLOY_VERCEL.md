# Deploying The Backend To Vercel

This backend is ready to deploy to Vercel as a separate project with the root directory set to `backend/`.

## Vercel project settings

1. Import the repository into Vercel.
2. Set the project's Root Directory to `backend`.
3. Keep the detected NestJS framework preset.
4. Use the default install and build commands from `backend/package.json`.

## Required environment variables

Set these in Vercel Project Settings -> Environment Variables:

```bash
MONGO_URI=...
MONGO_DB=mess_management
JWT_SECRET=...
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app
```

Optional seeded admin user:

```bash
SEED_DEFAULT_USER=true
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=change-me
DEFAULT_ADMIN_NAME=Admin
```

If `SEED_DEFAULT_USER` is not `true`, no default login is created.

## Local testing

Create `backend/.env` from `backend/.env.example`, then run:

```bash
npm install
npm run start:dev
```

To emulate the Vercel environment locally:

```bash
npx vercel dev
```
