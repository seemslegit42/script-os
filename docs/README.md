# ΛΞVON OS: Technical Briefing

### 1. 🏗️ Project Summary

*   **Name & Purpose**: **ΛΞVON OS** is a full-stack, agentic operating system built with Next.js. Its goal is to replace the "SaaS bloat" of modern business with a unified, intelligent, and conversational workspace. It orchestrates specialized AI agents ("daemons") and modular applications ("Micro-Apps") through a central command core named BEEP.

*   **Tech Stack**:
    *   **Core Framework**: Next.js 14 (App Router) with React 18.
    *   **Language**: TypeScript.
    *   **Styling**: Tailwind CSS with ShadCN UI components.
    *   **AI/Agentic Layer**: Google Genkit for flow orchestration, LangGraph for stateful agent construction, and Groq for high-speed LLM inference.
    *   **Database**: PostgreSQL managed with the Prisma ORM.
    *   **Cache**: DragonflyDB (via the Redis-compatible `ioredis` client).
    *   **CI/CD**: GitHub Actions for running Playwright E2E tests.

*   **Deployment/Environments**:
    *   The application is a monolithic Next.js app, likely deployed on a platform like Vercel.
    *   It relies on several environment variables (`.env`) for connecting to databases and external APIs (Firebase, Google, Groq, Resend, etc.).

### 2. 📁 File/Module Structure

*   **Hierarchy**: The codebase follows a standard Next.js App Router structure within the `src/` directory.
*   **Key Modules**:
    *   `src/app/`: Contains the application's routes. The root `page.tsx` is the primary dashboard, while `/login` and `/register` handle authentication flows. The `/api` subdirectory contains all backend REST endpoints.
    *   `src/ai/`: This is the brain of the OS.
        *   `agents/`: Defines the logic for each specialist AI agent (e.g., `beep.ts`, `aegis.ts`, `dr-syntax.ts`). Each is a Genkit flow, often using LangGraph for complex state management.
        *   `tools/`: Contains discrete, reusable functions (e.g., `crm-tools.ts`, `finance-tools.ts`) that are invoked by agents to interact with the database or external services.
    *   `src/components/`:
        *   `micro-apps/`: Contains the frontend React components for each individual "Micro-App" that can be launched on the main canvas.
        *   `ui/`: Base UI components from ShadCN.
        *   `icons/`: A large suite of custom-designed SVG icons, ensuring a unique visual identity.
    *   `src/services/`: A critical backend layer that encapsulates business logic (e.g., `ledger-service.ts`, `pulse-engine-service.ts`). This cleanly separates core logic from the API and agent layers.
    *   `src/store/`: Contains the client-side state management, powered by Zustand (`app-store.ts`).

### 3. 🧠 Core Logic & Flow

*   **Entry Points**: For an unauthenticated user, the flow starts at `/login`. For an authenticated user, it's `/`. The `middleware.ts` file handles this routing logic based on the presence of a `session` cookie.
*   **Authentication Flow**:
    1.  User enters email at `/login`, which calls `/api/auth/initiate`.
    2.  A magic link is sent via Resend.
    3.  Clicking the link goes to `/auth/action`, which verifies the token with Firebase Auth, then calls `/api/auth/session` to set a secure `HttpOnly` cookie.
    4.  New users are redirected to `/register/vow` to complete onboarding. Existing users land on the main page (`/`).
*   **Core Interaction Loop**:
    1.  The user types a command into the `TopBar` component.
    2.  The `app-store`'s `handleCommandSubmit` function is called.
    3.  This invokes the `processUserCommand` server action, which passes the command to the BEEP agent (`src/ai/agents/beep.ts`).
    4.  BEEP, a LangGraph state machine, uses Groq to quickly route the request to the appropriate specialist agents/tools defined in `src/ai/agents/tool-registry.ts`.
    5.  The agents execute, calling tools that may interact with the database (`prisma`), cache (`cache.ts`), or external APIs.
    6.  BEEP synthesizes the results and returns a structured payload.
    7.  The `app-store` updates its state with this payload, causing the UI (e.g., Micro-App grid) to reactively update.

### 4. ⚙️ Key Features & Functionality

*   **Agentic Command Core (BEEP)**: The central feature. A sophisticated LangGraph agent in `src/ai/agents/beep.ts` that uses a hierarchical routing strategy for speed and modularity.
*   **Dynamic UI Canvas**: A draggable and resizable windowing system managed by Zustand, `dnd-kit`, and `react-resizable`.
*   **Specialist Daemons**: A large collection of over 20 single-purpose AI agents for tasks like content critique, financial analysis, and HR satire (e.g., `Dr. Syntax`, `Stonks Bot`, `Pam Poovey`).
*   **Gamified Internal Economy**:
    *   **Obelisk Pay**: A credit system (ΞCredits) managed by `ledger-service.ts`.
    *   **Klepsydra Engine**: A "luck" and psychological modulation system in `pulse-engine-service.ts` that affects outcomes in "Folly Instruments" (gamified apps like `Sisyphus's Ascent`).
*   **Security Fabric (Aegis)**: An AI-powered security agent (`aegis.ts`) that scans user commands and system events for anomalies.
*   **Notable 3rd Party Dependencies**: `firebase` (auth), `genkit`/`langgraph` (AI), `groq-sdk` (LLM), `prisma` (ORM), `zustand` (state), `@dnd-kit/core` (drag-and-drop), `resend` (email), `ioredis` (cache).

### 5. 🪓 Pain Points & Complexity

*   **Agent Orchestration**: The `beep.ts` LangGraph, despite refactoring, remains the most complex single component. Debugging the flow through its router, executor, and synthesizer nodes requires deep familiarity with its state machine.
*   **State Management**: The central Zustand store (`app-store.ts`) is a potential chokepoint. The `handleCommandSubmit` function has a large number of responsibilities, from sending the command to processing the diverse agent reports that come back.
*   **Configuration Management**: The system relies heavily on a large number of environment variables. A missing or incorrect key (e.g., `GOOGLE_API_KEY`, `GROQ_API_KEY`) can cause runtime failures in the AI core. The code includes checks but the dependency is absolute.
*   **Data Flow Complexity**: The flow of data from a user command to an agent, to a service, to the database, and back to the UI is multi-layered. Tracing an issue through this entire stack can be difficult without robust, distributed tracing (which is not fully implemented beyond console logs).

### 6. 📦 Inputs & Outputs

*   **Primary Input**: User commands as natural language strings.
*   **Primary Output**: Rendered React components (Micro-Apps) on the canvas and text/audio feedback.
*   **Databases**:
    *   **PostgreSQL**: The main persistent store. The schema in `prisma/schema.prisma` is the source of truth for all data models.
    *   **DragonflyDB**: Used as a key-value cache for sessions and user profiles.
*   **External APIs**: The system makes outbound calls to Google AI (Vision/TTS), Groq (LLM), Firebase (Auth), Resend (Email), and various OSINT/data APIs.

### 7. 🧪 Testing & Coverage

*   **Unit Tests**: Minimal. A few tests exist for utility functions and the pulse engine service. Jest is configured. Run with `npm run test:unit`.
*   **E2E Tests**: Playwright is configured, with a small suite in `e2e/app.spec.ts` that covers basic app launching and a CRM workflow. Run with `npm run test:e2e`.
*   **Component Tests**: Storybook is extensively used for isolating and visually testing UI components in `src/components/ui`. Run with `npm run storybook`.
*   **Overall Coverage**: Appears low. The core agentic logic in `src/ai` and business logic in `src/services` lack dedicated unit or integration tests, relying on E2E tests for validation.

### 8. 🚀 Dev & Run Instructions

*   **Environment Setup**:
    1.  Create a `.env` file from `.env.example`.
    2.  Populate it with necessary API keys (Firebase, Google, Groq, Resend, etc.) and your `DATABASE_URL`.
*   **Local Development**:
    1.  Run `npm install` (or equivalent).
    2.  Run `npx prisma migrate dev` to apply database migrations.
    3.  Run `npx prisma db seed` to seed the database with initial data.
    4.  Run `npm run dev` to start the Next.js application.

### 9. 📚 Documentation Score

*   **Strengths**: The `src/docs` directory contains extensive high-level "lore" and architectural documents that explain the *why* behind the system's design. Zod schemas provide excellent data structure documentation implicitly. Many agent files have good JSDoc headers.
*   **Weaknesses**: There is a significant lack of inline code comments explaining *how* complex logic works, especially within the `beep.ts` LangGraph and the various services. There is no automatically generated API documentation.
