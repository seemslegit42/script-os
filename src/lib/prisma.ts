/**
 * @fileOverview Prisma Client Initialization
 * 
 * This file creates and exports a singleton instance of the Prisma Client.
 * This client is the sole interface for all backend services to communicate
 * with the PostgreSQL database. It ensures that all data access goes through
 * a single, well-defined point.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
