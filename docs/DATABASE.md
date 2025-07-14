# ΛΞVON OS: Database Schema Specification

> "The architecture of truth is built on well-defined tables."

---

## 1. Core Principles & Stack

The data layer of ΛΞVON OS is the foundational substrate from which our agentic intelligence arises. It is built to be globally fast, effortlessly scalable, and immune to the connection bottlenecks that plague traditional architectures.

### 1.1. Core Principles
* **Multi-Tenancy (Workspace-Scoped):** Every primary table includes a `workspaceId` column. This key is used in every query to ensure strict data isolation between workspaces.
* **UUIDs for Public IDs:** While primary keys may be auto-incrementing integers for performance, a `uuid` column is used for any record that needs to be exposed externally via an API.
* **JSONB for Flexibility:** JSONB data types are used for storing unstructured or semi-structured data like custom fields, workflow definitions, or agentic tool parameters.
* **Timestamps:** Standard `createdAt` and `updatedAt` columns are present on all tables for auditing and tracking.

### 1.2. Database Stack
* **ORM:** Prisma is the chosen ORM for all TypeScript services, providing a type-safe client and powerful migrations.
* **Connection Layer:** Prisma Accelerate is mandated for use, providing managed connection pooling and global caching at the edge.
* **Database Platform:** The primary database is a serverless PostgreSQL instance, managed via Neon, aligning with our cloud-native, microservices-based architecture.
* **Vector Search:** The `pgvector` extension is enabled within PostgreSQL for storing and querying vector embeddings, essential for AI memory features.

---

## 2. Prisma Schema Definition

The following is the definitive V1 schema.

```prisma
// datasource db {
//   provider     = "postgresql"
//   url          = env("DATABASE_URL")
//   relationMode = "prisma"
// }

// generator client {
//   provider = "prisma-client-js"
// }

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sovereigntyClass String @default("INITIATE") // INITIATE, SOVEREIGN, ARCHITECT

  wallet      UserWallet?
  canvasState CanvasState?
  psycheState PsycheState?
  instances   MicroAppInstance[]
}

model UserWallet {
  id      String @id @default(cuid())
  userId  String @unique
  user    User   @relation(fields: [userId], references: [id])
  balance BigInt @default(1000) // Starting balance
}

model CanvasState {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])
  layout Json // JSON representation of Micro-App positions and sizes
}

model MicroApp {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  developerId String
  instances   MicroAppInstance[]
}

model MicroAppInstance {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  microAppId String
  microApp   MicroApp @relation(fields: [microAppId], references: [id])
  state      Json     // Specific state for this user's instance of the app
  createdAt  DateTime @default(now())
}

model Transaction {
  id              String   @id @default(cuid())
  amount          BigInt
  memo            String
  fromUserId      String
  toUserId        String
  createdAt       DateTime @default(now())
  aegisSignature  String   // Signature from Aegis to verify integrity
}

model PsycheState {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id])
  sreWave           Float    // Sine-Rhythm Engine value (-1.0 to 1.0)
  lossStreak        Int      @default(0)
  frustrationLevel  Float    @default(0.0) // Metric monitored by Aegis
  isThrottled       Boolean  @default(false)
}
```
