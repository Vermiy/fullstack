## Install Dependencies

```bash
cd backend
npm install

cd ../inforce-fullstack
npm install
```

## Required Environment Variables

Create `backend/.env` with:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inforce"
JWT_SECRET="change-this-secret"
PORT=3000

# Optional (defaults shown)
DEFAULT_ADMIN_NAME=admin
DEFAULT_ADMIN_EMAIL=admin@gmail.com
DEFAULT_ADMIN_PASSWORD=adminadmin
NODE_ENV=development
```


## Database Setup

1. Ensure PostgreSQL is running.
2. Create a database (example name: `inforce`).
3. Apply Prisma migrations from the backend folder:

```bash
cd backend
npm run prisma:migrate
```

4. (Optional) Regenerate Prisma client:

```bash
npm run prisma:generate
```

Notes:

- The backend reads `DATABASE_URL` from `backend/.env` in non-production mode.
- On startup, a default admin user is auto-created if it does not already exist.

Default admin credentials (unless changed by env vars):

- Email: `admin@gmail.com`
- Password: `adminadmin`

## Run Backend

From `backend`:

```bash
npm run start:dev
```

Backend base URL: `http://localhost:3000`

Global API prefix: `/api`

## Run Frontend

From `inforce-fullstack`:

```bash
npm run dev
```

Frontend URL: `http://localhost:3001` (or next available port shown by Next.js)

## Available API Routes

All routes below are served under `http://localhost:3000/api`.

### Auth

- `POST /auth/signup` -> register user, sets `accessToken` cookie
- `POST /auth/login` -> login user, sets `accessToken` cookie
- `GET /auth/me` -> get current user (requires JWT)
- `POST /auth/logout` -> clear auth cookie (requires JWT)

### Users

- `POST /users` -> create user
- `GET /users` -> list users
- `GET /users/:id` -> get user by id
- `PATCH /users/:id` -> update user
- `DELETE /users/:id` -> delete user

### Books

- `POST /books` -> create book
- `GET /books` -> list books
- `GET /books/:id` -> get book by id
- `PATCH /books/:id` -> update book
- `DELETE /books/:id` -> delete book

## Role-Based Access Rules

Current roles in the system:

- `USER`
- `ADMIN`

How roles are assigned:

- New users default to `USER`.
- Startup seeding creates one `ADMIN` user.

## Project Structure

```text
inforce/
|-- backend/                # NestJS API + Prisma (auth/users/books)
|   |-- src/
|   |   |-- app.controller.ts
|   |   |-- app.module.ts
|   |   |-- main.ts
|   |   |-- decorators/
|   |   |   `-- roles.decarator.ts
|   |   |-- guards/
|   |   |   |-- jwt.guard.ts
|   |   |   `-- roles.guard.ts
|   |   |-- modules/
|   |   |   |-- auth/
|   |   |   |   |-- auth.controller.ts
|   |   |   |   |-- auth.module.ts
|   |   |   |   |-- auth.service.ts
|   |   |   |   |-- jwt.strategy.ts
|   |   |   |   |-- dto/
|   |   |   |   `-- entities/
|   |   |   |-- books/
|   |   |   |   |-- books.controller.ts
|   |   |   |   |-- books.module.ts
|   |   |   |   |-- books.service.ts
|   |   |   |   |-- dto/
|   |   |   |   `-- entities/
|   |   |   `-- users/
|   |   |       |-- users.controller.ts
|   |   |       |-- users.module.ts
|   |   |       |-- users.service.ts
|   |   |       |-- dto/
|   |   |       `-- entities/
|   |   `-- prisma/
|   |       |-- prisma.module.ts
|   |       `-- prisma.service.ts
|   |-- prisma/
|   |-- generated/
|   `-- package.json
|-- inforce-fullstack/      # Next.js frontend app
|   |-- src/
|   |   |-- app/
|   |   |   |-- layout.tsx
|   |   |   |-- page.tsx
|   |   |   |-- globals.css
|   |   |   |-- login/
|   |   |   |-- signup/
|   |   |   |-- forbidden/
|   |   |   |-- books/
|   |   |   |   |-- page.tsx
|   |   |   |   `-- [id]/
|   |   |   `-- users/
|   |   |       |-- page.tsx
|   |   |       `-- [id]/
|   |   |-- components/
|   |   |   |-- BookCard.tsx
|   |   |   |-- UserCard.tsx
|   |   |   |-- headers/
|   |   |   |   |-- AdminHeader.tsx
|   |   |   |   |-- DynamicHeader.tsx
|   |   |   |   |-- GuestHeader.tsx
|   |   |   |   |-- LogoutButton.tsx
|   |   |   |   `-- UserHeader.tsx
|   |   |   `-- modals/
|   |   |       |-- CreateBookModal.tsx
|   |   |       |-- CreateUserModal.tsx
|   |   |       |-- EditBookModal.tsx
|   |   |       `-- EditUserModal.tsx
|   |   |-- config/
|   |   |-- providers/
|   |   |-- services/
|   |   |-- store/
|   |   `-- types/
|   |-- public/
|   `-- package.json
|-- preview/                # Preview artifacts
`-- readme.md               # Project setup and usage docs
```

## Preview Images

![Preview 1](preview/2026-05-05_09-10.png)

![Preview 2](preview/2026-05-05_09-19.png)
