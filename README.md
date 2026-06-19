# Blogging Website

A blog application with user auth and CRUD for blog posts. Built with Express,
EJS (server-side rendering), MongoDB/Mongoose, JWT auth, and multer image uploads.

## Tech stack

- Node.js + Express
- EJS views
- MongoDB via Mongoose
- JWT (cookie-based) auth, bcrypt password hashing
- multer for cover-image uploads

## Environment variables

See `.env.example`. For local development create a `.env` file:

| Variable      | Description                                    |
| ------------- | ---------------------------------------------- |
| `MONGODB_URI` | MongoDB connection string                      |
| `JWT_SECRET`  | Secret used to sign auth tokens                |
| `PORT`        | Port to listen on (defaults to 3000)           |

## Run locally

```bash
npm install
npm run dev   # or: npm start
```

Requires a running MongoDB (local or remote) and Node 20.

## Deploy on Railway

1. Push this repo to GitHub.
2. On [railway.app](https://railway.app): **New Project → Deploy from GitHub repo** → pick this repo.
3. In the project, click **New → Database → Add MongoDB**. Railway provisions it
   and exposes a `MONGO_URL` variable on the MongoDB service.
4. Open the **app service → Variables** and add:
   - `MONGODB_URI` = `${{MongoDB.MONGO_URL}}/blogify`  (references the DB service; `/blogify` is the database name)
   - `JWT_SECRET`  = any long random string
5. Railway sets `PORT` automatically and runs `npm start`.
6. Under the app service **Settings → Networking**, generate a public domain to access the site.
