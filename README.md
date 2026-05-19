## Local Development Setup

Follow these steps to get the project running on your local machine:

### Prerequisites

- **Node.js:** v18 or higher.
- **npm:** v9 or higher.
- **PostgreSQL:** A running instance of Postgres.

### Setup Steps

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd insignia-mock-test
   ```
2. **Install Dependencies:**
   Install all workspace dependencies from the root:
   ```bash
   npm install
   ```
3. **Configure Environment:**
   Create a `.env` file in the root directory and provide the necessary values:
   ```env
   # Database
   DATABASE_URL=""

   # Backend Server
   PORT=3000
   NODE_ENV="development"

   # Authentication Secrets
   JWT_ACCESS_SECRET=""
   JWT_REFRESH_SECRET=""

   # Frontend
   VITE_API_URL="/api"
   ```
4. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate -w backend
   ```
5. **Initialize Database:**
   Run Prisma migrations to set up the database schema:
   ```bash
   npm run prisma:migrate -w backend
   ```
   *Note: If you lack permissions to create a shadow database (e.g., restricted Postgres user), you can use `npx prisma db push` from the `apps/backend` directory instead.*
6. **Seed Database:**
   Run the seeder to create initial accounts (`admin` and `abdan`):
   ```bash
   npm run seed -w backend
   ```
   *Note: Default passwords are `admin123` and `abdan123` respectively.*
7. **Start Development Environment:**
   Run both frontend and backend concurrently:

   ```bash
   npm run dev
   ```

   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000` (proxied via `/api`)

---

[Full Technical Design Document (TDD)](docs/TDD.md)
