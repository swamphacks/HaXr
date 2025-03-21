# HaXr

This is our main system for applications and event management for SwampHacks.

## Getting Started

First clone the repository and run `npm install`.

You will need create a `.env` file with the following variables:

```dotenv
# Auth.js
AUTH_SECRET="..." # random token used to encrypt keys
AUTH_GITHUB_ID="..." # GitHub OAuth Client ID
AUTH_GITHUB_SECRET="..." # GitHub OAuth Client Secret

# Prisma
POSTGRES_PRISMA_URL="..." # pooled
POSTGRES_URL_NON_POOLING="..." # non-pooled

# Vercel Blob
BLOB_READ_WRITE_TOKEN="..." # for file store (images, resumes, etc.)

# Discord Bot
DISCORD_BOT_TOKEN="..." # for Discord bot (role management)
```

An `AUTH_SECRET` can be generated by running `npm exec auth secret` (or `auth secret`). You can create a new GitHub
OAuth application [here](https://github.com/settings/applications/new). The callback url should be set
to `http://localhost:3000/api/auth/callback/github`.

Then, create a Vercel Blob storage and set `BLOB_READ_WRITE_TOKEN`.

Lastly, to set up the database you should provision a Postgres database on Vercel, copy down the corresponding
environment variables, and run `prisma db push` to set up the schema. You can run `prisma studio` to edit records and
designate yourself as an admin after you sign in (you will have to log in again).

Run `npm run dev` to start the development server.
