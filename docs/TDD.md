# Technical Design Document (TDD) - Insignia Mock Test

## 1. Architecture Overview

The project is structured as a **Monorepo** using **npm workspaces** to manage multiple packages within a single repository. This approach ensures version consistency and allows for seamless code sharing between the frontend and backend.

- **Frontend:** A modern React application built with **Vite**, utilizing **TanStack Router** for type-safe routing and **TanStack Query** for efficient data fetching and state management.
  - **Folder Structure:** Follows a **Feature-based approach** (`src/features/`) where each domain (e.g., `auth`, `wallet`, `stats`) contains its own components, API hooks, and logic.
  - **Layout Strategy:** Implements three distinct root layouts: **No Auth** (public), **User Auth** (mobile-optimized), and **Admin Auth** (desktop-optimized).
- **Backend:** A Node.js application using **Express**, designed with a **Thin Layered Architecture** (Controller -> Service -> Repository). It follows a **Functional approach**, using plain objects and functions to minimize boilerplate and ensure high performance.
- **Shared Module:** A centralized `modules/shared` package that houses shared TypeScript types and **Zod schemas**, acting as the "Source of Truth" for data contracts between the frontend and backend.
- **Communication:** Standard REST API communication. In development, a Vite proxy is used to bridge the apps, while Nginx handles the reverse proxy in production.

## 2. Portability & Implementation

The implementation prioritizes **type safety** and **developer experience** through the following practices:

- **End-to-End Type Safety:** By using Zod schemas in the shared module, the backend validates incoming data and the frontend receives fully typed responses, preventing runtime errors.
- **Clean Separation of Concerns:** The backend's 3-layer structure isolates business logic (Services) from the delivery mechanism (Controllers) and data access (Repositories).
- **Environment Management:** A single root `.env` file manages configurations for all workspaces, ensuring consistency across the entire stack.
- **Container-Ready Design:** While optimized for PM2/Nginx deployment, the architecture is designed to be easily containerized (Docker) due to its decoupled nature.
- **Scaling:** New features can be added by creating new services and repositories without affecting existing logic, and new frontend/backend apps can be added as new workspaces.

### Frontend Tech Stack & Implementation

- **Styling:** **Tailwind CSS** for utility-first responsive design.
- **Icons:** **Lucide React** for consistent iconography.
- **Visualization:** **Recharts** for data visualization in the Admin dashboard.
- **API Client:** **Axios** with a centralized configuration (`src/lib/axios.ts`) for handling base URLs, credentials, and interceptors.
- **TanStack Query Best Practices:**
  - API calls are encapsulated in custom hooks within feature folders (e.g., `src/features/wallet/api/use-topup.ts`).
  - Implements stale-while-revalidate patterns and cache invalidation after successful mutations.
  - Centralized error handling via global query client configuration.

### Authentication & Authorization Strategy

The project implements a **Stateless JWT-based Authentication** system designed for high security and scalability:

- **Tokens:** Uses short-lived **Access Tokens** for authorization and long-lived **Refresh Tokens** for maintaining sessions.
- **Security:** Tokens are stored in **Secure, httpOnly Cookies**. This protects the application against Cross-Site Scripting (XSS) attacks, as the tokens cannot be accessed via client-side JavaScript.
- **Session Persistence:** The frontend maintains a global `AuthContext` that initializes by calling `GET /auth/me` on application load. A loading guard in `main.tsx` ensures the session is resolved before rendering routes.
- **Refresh Flow:** When an Access Token expires, the frontend automatically uses the Refresh Token to obtain a new one. Refresh Tokens are stored in the database, allowing for specific sessions to be revoked if necessary.
- **Authorization:** A centralized `authMiddleware` on the backend validates the JWT in the cookie before allowing access to protected routes.
- **Role-Based Access Control (RBAC):** Roles (e.g., `ADMIN`, `USER`) are encoded in the JWT payload. The frontend enforces this via TanStack Router's `beforeLoad` guards and nested layouts (`user.tsx`, `admin.tsx`, and a protected `_guest` layout).
- **Redirection Logic:** 
    - **Guest Guard:** Authenticated users are reactively redirected away from `/login` and `/register`.
    - **Auth Guard:** Unauthenticated users are redirected to `/login` when attempting to access protected dashboard routes.
    - **Centralized Logout:** A unified `logout` function handles state clearing, cache purging, and immediate redirection.

## 3. Data Model

The data layer uses **Prisma** with **PostgreSQL**. The schema is designed to handle user accounts, role-based access, and a transaction-based ledger system.

### Core Models

#### `User`

Stores account information and current balance.

- `id` (UUID): Primary key.
- `username` (String): Unique identifier used for transfers.
- `password` (String): Hashed.
- `role` (Enum): `ADMIN` or `USER`.
- `balance` (Decimal): Current wallet balance.
- `createdAt` / `updatedAt`: Timestamps.

#### `Transaction`

Records every movement of funds (Top-ups and Transfers).

- `id` (UUID): Primary key.
- `type` (Enum): `TOPUP` or `TRANSFER`.
- `amount` (Decimal): Value of the transaction.
- `senderId` (UUID, optional): Reference to `User` (null for Top-ups).
- `receiverId` (UUID): Reference to `User`.
- `createdAt` (DateTime): Timestamp.

### Relationships

- A `User` has many `sentTransactions` (as sender).
- A `User` has many `receivedTransactions` (as receiver).

#### `RefreshToken`

Used to manage persistent sessions and allow for remote revocation.

- `id` (UUID): Primary key.
- `token` (String): Unique hashed refresh token.
- `userId` (UUID): Reference to `User`.
- `expiresAt` (DateTime): Expiry timestamp for the session.
- `createdAt` (DateTime).

## 4. Routing & API Reference

### Frontend Routes & Layouts

#### 1. No Auth Layout (Public)

- **Container:** Standard web layout.
- **Routes:**
  - `/`: Landing page. Features a welcome banner introducing "Insignia Wallet".
    - **Dynamic UI:** Below the banner, show "Login" and "Register" buttons for guests. If the user is authenticated, replace these with "Go to Dashboard" and "Logout" buttons.
  - `/login`: Accessible only to **Unauthenticated** users.
    - **Logic:** After successful login, redirect to `/admin` if the role is `ADMIN`, or `/user` if the role is `USER`.
  - `/register`: Accessible only to **Unauthenticated** users. Registration form titled "Create new wallet" (mobile max-width).

#### 2. User Auth Layout (Authenticated User)

- **Container:** Mobile-optimized (`max-width: mobile`).
- **Navigation:** Navbar with `space-between` alignment showing "Hello, {name}" and a Logout button.
- **Routes:**
  - `/user`: Homepage. Vertical column layout (`flex-col`). Displays current balance, shortcut buttons for Top-up and Transfer (`flex-auto`), and a scrollable transaction list (descending by timestamp).
  - `/user/top-up`: Selection screen with shortcut amount cards. Includes an "Other" option to show a numeric input. Action: Submit button to trigger Top-up.
  - `/user/transfer`:
    - **Step 1:** Recipient Search/Add. Checks database for existence.
    - **Step 2:** Local persistence. Recipients are saved as an array of usernames in `LocalStorage` and displayed as cards.
    - **Step 3:** Execution. Selecting a recipient opens a **Dialog/Modal** to input the amount and submit the transfer API request.

#### 3. Admin Auth Layout (Authenticated Admin)

- **Container:** Desktop-optimized (`max-width: small desktop`).
- **Navigation:** Navbar + Sidebar + Content area layout.
- **Routes:**
  - `/admin`: Dashboard. Displays data visualization using **Recharts** for transaction volumes and user growth. Falls back to tables if data is insufficient.
  - `/admin/history`: Comprehensive table of all system transactions. Implements frontend-side pagination.
  - `/admin/user-manager`: User directory showing all usernames and current balances. Implements frontend-side pagination.

### Backend API Reference (All prefixed with /api)

### Authentication

- `POST /auth/register`: Public. Register as a `USER`.
- `POST /auth/login`: Public. Authenticate, create `RefreshToken` in DB, and receive `httpOnly` cookies.
- `POST /auth/refresh`: Public. Use valid `RefreshToken` cookie to issue a new `AccessToken`.
- `POST /auth/logout`: Protected. Delete `RefreshToken` from DB and clear cookies.

### Wallet Operations

- `GET /wallet/balance`:
  - `USER`: Returns own balance.
  - `ADMIN`: Returns list of all users and their balances.
- `GET /wallet/check-user/:username`: Protected. Verifies if a recipient username exists before adding to local storage.
- `POST /wallet/topup`: `USER` only. Increment own balance and record transaction.
- `POST /wallet/transfer`: `USER` only. Deduct from sender, increment receiver (by `username`), and record transaction.
- `GET /wallet/transactions`:
  - `USER`: Returns own credit/debit history.
  - `ADMIN`: Returns all transactions in the system.

### Dashboard & Statistics

- `GET /stats/top-transactions`: Returns top 10 transactions by amount.
  - `USER`: Own top 10.
  - `ADMIN`: Global top 10 (includes names).
- `GET /stats/top-users`: Returns top 10 users by transfer volume.
  - `USER`: Top 10 users by their total outbound transfer value.
  - `ADMIN`: Top 10 users with aggregate sender, receiver, and total volume.

## 5. Infrastructure

The application is designed to be deployed on a Linux VPS (e.g., Ubuntu) using a combination of Nginx and PM2.

- **Nginx (Static Server & Reverse Proxy):**
  - Serves the compiled React frontend files from `apps/frontend/dist`.
  - Acts as a reverse proxy, forwarding requests starting with `/api/` to the backend application.
  - Handles SSL termination (HTTPS) via Let's Encrypt.
- **PM2 (Process Management):**
  - Manages the Node.js backend process (`apps/backend/dist/index.js`).
  - Ensures the application restarts automatically on failure or server reboot.
  - Handles log management and monitoring via `ecosystem.config.js`.
- **Database:** PostgreSQL instance (managed or local) accessed via Prisma ORM.
- **Environment Variables:** Managed via a root `.env` file. Critical variables include `DATABASE_URL`, `PORT`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`.

## 6. Local Development Setup

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
   Create a `.env` file in the root directory (referencing the `.env.example` if available) and provide your `DATABASE_URL`.
4. **Initialize Database:**
   Run Prisma migrations to set up the database schema:
   ```bash
   npm run prisma:migrate -w backend
   ```
5. **Seed Database:**
   Run the seeder to create initial ADMIN and USER accounts:
   ```bash
   npx prisma db seed -w backend
   ```
6. **Start Development Environment:**
   Run both frontend and backend concurrently:

   ```bash
   npm run dev
   ```

   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000` (proxied via `/api`)
