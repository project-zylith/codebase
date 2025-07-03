# Backend Setup Guide

This is a TypeScript backend with PostgreSQL database integration and AI insights functionality.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp env.example .env
   ```

   Edit `.env` with your database credentials and API keys:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   DB_NAME=renaissance_db
   API_KEY=your_google_ai_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

3. **Create PostgreSQL database:**

   ```sql
   CREATE DATABASE renaissance_db;
   ```

4. **Run database migrations:**
   ```bash
   npm run migrate
   ```

## Development

- **Build TypeScript:**

  ```bash
  npm run build
  ```

- **Start development server:**

  ```bash
  npm run dev
  ```

- **Create new migration:**

  ```bash
  npm run migrate:make migration_name
  ```

- **Run seeds (if any):**
  ```bash
  npm run seed
  ```

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion

### AI Insights

- `POST /api/insights` - Generate insights for a goal
- `POST /api/finalInsight` - Generate final insights from array

## Database Schema

### Tasks Table

- `id` (Primary Key, Auto Increment)
- `title` (String, Required)
- `description` (Text, Optional)
- `completed` (Boolean, Default: false)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## TypeScript Features

- Full type safety with interfaces
- Proper error handling
- Database connection with Knex
- Express.js with TypeScript
- Environment variable typing
