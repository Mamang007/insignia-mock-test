## Local Development Setup

Follow these steps to get the project running on your local machine:

### Prerequisites

- **Node.js:** v18 or higher.
- **npm:** v9 or higher.
- **PostgreSQL:** A running instance of Postgres.

### Setup Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Mamang007/insignia-mock-test.git
   cd insignia-mock-test
   ```
2. **Install Dependencies:**
   Install all workspace dependencies from the root:
   ```bash
   npm install
   ```
3. **Create Database:**
   Create a new PostgreSQL database (e.g., using `psql` or a GUI tool like pgAdmin):
   ```sql
   CREATE DATABASE insignia_wallet;
   ```
4. **Configure Environment:**
   Create a `.env` file in the root directory and provide the necessary values (replace placeholders with your actual credentials):

   ```env
   # Database
   DATABASE_URL="postgresql://yourusername:yourpassword@localhost:5432/insignia_wallet?schema=public"

   # Backend Server
   PORT=3000
   NODE_ENV="development"

   # Authentication Secrets
   JWT_ACCESS_SECRET="your_access_secret"
   JWT_REFRESH_SECRET="your_refresh_secret"

   # Frontend
   VITE_API_URL="/api"
   ```

5. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate -w backend
   ```
6. **Initialize Database:**
   Run Prisma migrations to set up the database schema:
   ```bash
   npm run prisma:migrate -w backend
   ```
   _Note: If you lack permissions to create a shadow database (e.g., restricted Postgres user), you can use `npx prisma db push` from the `apps/backend` directory instead._
7. **Seed Database:**
   Run the seeder to create initial accounts (`admin` and `abdan`):
   ```bash
   npm run seed -w backend
   ```
   _Note: Default passwords are `admin123` and `abdan123` respectively._
8. **Start Development Environment:**
   Run both frontend and backend concurrently:

   ```bash
   npm run dev
   ```

   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000` (proxied via `/api`)

---

[Full Technical Design Document (TDD)](docs/TDD.md)
